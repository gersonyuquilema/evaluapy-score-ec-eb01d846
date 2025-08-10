import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

async function subirArchivoFinanciero(empresaId: string, archivoFile: File) {
  const ruta = `${empresaId}/${archivoFile.name}`;
  const { data, error } = await supabase.storage
    .from("documentos")
    .upload(ruta, archivoFile);

  if (error) throw error;
  return data?.path;
}

export default function DocumentosFinancieros({ empresaId }: { empresaId: string }) {
  const [archivo, setArchivo] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!archivo) return;
    const url_archivo = await subirArchivoFinanciero(empresaId, archivo);
    // Aquí puedes insertar en la tabla documentos_financieros usando supabase.from("documentos_financieros").insert(...)
    alert("Archivo subido: " + url_archivo);
  };

  return (
    <div>
      <input type="file" onChange={e => setArchivo(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Subir archivo</button>
    </div>
  );
}