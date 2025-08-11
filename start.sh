#!/bin/bash
# filepath: /workspaces/evaluapy-score-ec-eb01d846/start.sh

# Instala dependencias Python
pip install lightgbm transformers sentence-transformers scikit-learn pandas numpy joblib

# Instala dependencias Node
npm install

# Exporta variables de entorno (ajusta tus claves)
export SUPABASE_URL="https://ywlyxdgcgwdwkyaelvtx.supabase.co"
export SUPABASE_KEY="sb_secret_MqJDBd13EXLDKlfacGB2_Q_nx6vJnw_"

# Inicia backend en segundo plano
uvicorn app:app --reload --host 0.0.0.0 --port 8000 &

# Inicia frontend en segundo plano
npm run dev &

# Espera unos segundos para que los servicios arranquen
sleep 5

# Abre la app en el navegador
"$BROWSER" http://localhost:8001