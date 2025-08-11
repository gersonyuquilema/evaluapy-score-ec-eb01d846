import io, json
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import joblib
import torch
from transformers import AutoTokenizer, AutoModel
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Habilita CORS (ajusta orígenes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # pon tu dominio/localhost en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Carga modelo y assets al iniciar ----
MODEL_PATH = "modelo_lgb_finanzas.pkl"
FEATURES_PATH = "feature_columns.json"  # nombres de columnas tabulares usadas en entrenamiento (opcional, ver sección 2)
TEXT_COL = "texto_financiero"          # columna de texto a embeber (si no existe, se crea vacía)

try:
    model_lgb = joblib.load(MODEL_PATH)
except Exception as e:
    model_lgb = None
    print(f"[WARN] No pude cargar {MODEL_PATH}: {e}")

# Si guardaste los nombres de columnas tabulares al entrenar, cárgalos:
try:
    with open(FEATURES_PATH, "r", encoding="utf-8") as f:
        FEATURE_COLUMNS = json.load(f)
except Exception:
    FEATURE_COLUMNS = None  # si no existe, intentaremos inferir del DF (menos robusto)

# FinBERT
tokenizer = AutoTokenizer.from_pretrained('yiyanghkust/finbert-tone')
finbert = AutoModel.from_pretrained('yiyanghkust/finbert-tone')
finbert.eval()

def load_balances_txt_bytes(file_bytes: bytes) -> pd.DataFrame:
    # intenta con tabulador y cae a coma
    try:
        return pd.read_csv(io.BytesIO(file_bytes), delimiter="\t", encoding="utf-8", on_bad_lines="skip")
    except Exception:
        return pd.read_csv(io.BytesIO(file_bytes), delimiter=",", encoding="utf-8", on_bad_lines="skip")

def get_finbert_embedding(text: str) -> np.ndarray:
    tokens = tokenizer(text if isinstance(text, str) else "", return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = finbert(**tokens)
    emb = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
    return emb

def ensure_text_column(df: pd.DataFrame) -> pd.DataFrame:
    if TEXT_COL not in df.columns:
        df[TEXT_COL] = ""  # vacío por defecto
    return df

def build_feature_matrix(df: pd.DataFrame) -> np.ndarray:
    """
    Construye X = [tabular | embedding], garantizando el mismo orden de columnas tabulares de entrenamiento.
    """
    df = ensure_text_column(df)

    # Embeddings
    embs = np.vstack(df[TEXT_COL].fillna("").apply(get_finbert_embedding).values)  # shape: (n, 768)

    # Tabular
    drop_cols = ["ruc", TEXT_COL]
    if FEATURE_COLUMNS is not None:
        # Usar exactamente las columnas guardadas en entrenamiento
        for c in FEATURE_COLUMNS:
            if c not in df.columns:
                df[c] = 0
        X_tab = df[FEATURE_COLUMNS].fillna(0).values
    else:
        # Fallback: todas las numéricas excepto drop_cols
        df_tab = df.drop(columns=[c for c in drop_cols if c in df.columns], errors="ignore")
        df_tab = df_tab.select_dtypes(include=[np.number]).fillna(0)
        X_tab = df_tab.values

    # Concatenar
    X = np.hstack([X_tab, embs])
    return X

@app.post("/predict")
async def predict(
    ruc_objetivo: str = Form(...),
    balances_file: UploadFile = File(...),
    referencias_file: UploadFile = File(...),
    datos_digitales_file: UploadFile = File(...),
) -> dict:
    if model_lgb is None:
        raise HTTPException(status_code=500, detail="Modelo no cargado. Sube 'modelo_lgb_finanzas.pkl' al servidor.")

    # Leer archivos en memoria
    balances_bytes = await balances_file.read()
    referencias_bytes = await referencias_file.read()
    datos_digitales_bytes = await datos_digitales_file.read()

    # Cargar DFs
    balances = load_balances_txt_bytes(balances_bytes)
    referencias = pd.read_csv(io.BytesIO(referencias_bytes))
    datos_digitales = pd.read_csv(io.BytesIO(datos_digitales_bytes))

    # Filtrar por RUC
    balances_empresa = balances[balances["ruc"] == ruc_objetivo]
    referencias_empresa = referencias[referencias["ruc"] == ruc_objetivo]
    datos_digitales_empresa = datos_digitales[datos_digitales["ruc"] == ruc_objetivo]

    if balances_empresa.empty:
        raise HTTPException(status_code=400, detail=f"No hay balances para el RUC {ruc_objetivo}")

    # Merge por ruc (ajusta según tus llaves reales)
    df = balances_empresa.merge(referencias_empresa, on="ruc", how="left")
    df = df.merge(datos_digitales_empresa, on="ruc", how="left")

    # Construir matriz de features
    X = build_feature_matrix(df)

    # Predicción probabilidad clase positiva (label=1=“buen riesgo” o lo que uses)
    proba = model_lgb.predict(X)
    # Si devuelve vector por fila, usar .reshape(-1,) o tomar promedio
    proba = np.array(proba).reshape(-1)

    # Aquí definimos el SCORE 0-100 como el promedio de probas * 100
    # (puedes usar percentiles, calibración o cualquier mapeo adicional si lo prefieres)
    score = float(np.clip(np.mean(proba) * 100.0, 0, 100))

    # También puedes devolver detalle por registro si te sirve
    return {
        "ruc": ruc_objetivo,
        "score": round(score),
        "n_registros": int(len(df)),
        "probabilidades": proba[:50].tolist()  # recorte opcional
    }
