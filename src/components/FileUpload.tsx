import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
  nombreEmpresa: string; // <-- Agrega esto
  acceptedTypes?: string[];
  maxFiles?: number;
  className?: string;
}

const FileUpload = ({ 
  onFilesUploaded, 
  nombreEmpresa,
  acceptedTypes = ['.csv', '.txt', '.pdf', '.xlsx', '.xls'],
  maxFiles = 5,
  className = "" 
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedTypes.includes(extension);
    });

    if (validFiles.length !== fileArray.length) {
      toast({
        title: "Archivos no válidos",
        description: `Solo se permiten archivos: ${acceptedTypes.join(', ')}`,
        variant: "destructive",
      });
    }

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      toast({
        title: "Límite excedido",
        description: `Máximo ${maxFiles} archivos permitidos`,
        variant: "destructive",
      });
      return;
    }

    const newFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);

    if (validFiles.length > 0) {
      toast({
        title: "Archivos cargados",
        description: `${validFiles.length} archivo(s) cargado(s) exitosamente`,
      });
    }
  }, [uploadedFiles, acceptedTypes, maxFiles, onFilesUploaded, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  async function subirArchivoAlBucket(nombreEmpresa: string, archivo: File) {
    const ruta = `${nombreEmpresa}/${archivo.name}`;
    const { data, error } = await supabase.storage
      .from("documentos")
      .upload(ruta, archivo);

    if (error) throw error;
    return data?.path;
  }

  const handleProcesarArchivos = async () => {
    if (uploadedFiles.length === 0) return;
    try {
      if (!nombreEmpresa) {
        toast({
          title: "Error",
          description: "No se ha definido el nombre de la empresa.",
          variant: "destructive",
        });
        return;
      }

      for (const archivo of uploadedFiles) {
        await subirArchivoAlBucket(nombreEmpresa, archivo); // <-- Usa el nombre de la empresa
      }
      toast({
        title: "Archivos subidos",
        description: "Todos los archivos fueron subidos al bucket de Supabase.",
      });
    } catch (err: any) {
      toast({
        title: "Error al subir archivos",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Subir Documentos Financieros</h3>
          <p className="text-muted-foreground text-sm">
            Facturas, estados financieros, historial de pagos
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Arrastra tus archivos aquí
            </p>
            <p className="text-muted-foreground">
              o haz clic para seleccionar
            </p>
            <p className="text-sm text-muted-foreground">
              Formatos: {acceptedTypes.join(', ')} • Máximo {maxFiles} archivos
            </p>
          </div>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Archivos Cargados ({uploadedFiles.length})</h4>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <Button
            className="w-full bg-gradient-primary hover:opacity-90"
            onClick={handleProcesarArchivos}
            disabled={!nombreEmpresa}
          >
            Procesar Documentos ({uploadedFiles.length})
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;

/* Uso del componente FileUpload
<FileUpload
  nombreEmpresa={empresa.nombre} // Asegúrate que empresa.nombre tenga valor
  onFilesUploaded={...}
/> */