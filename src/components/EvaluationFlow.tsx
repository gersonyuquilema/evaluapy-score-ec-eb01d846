import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import FileUpload from "./FileUpload";
import RiskMeter from "./RiskMeter";
import { Building2, Globe, Upload, BarChart3, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EvaluationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    ruc: "",
    industry: "",
    socialMedia: "",
    files: [] as File[]
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<number | null>(null);
  const { toast } = useToast();

  const steps = [
    { number: 1, title: "Información Básica", icon: Building2 },
    { number: 2, title: "Documentos Financieros", icon: Upload },
    { number: 3, title: "Redes Sociales", icon: Globe },
    { number: 4, title: "Evaluación IA", icon: BarChart3 },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const simulateEvaluation = async () => {
    setIsEvaluating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a realistic score based on form completeness
    const baseScore = 60;
    const bonuses = [
      formData.companyName ? 5 : 0,
      formData.ruc ? 5 : 0,
      formData.files.length > 0 ? 15 : 0,
      formData.socialMedia ? 10 : 0,
    ];
    
    const finalScore = Math.min(100, baseScore + bonuses.reduce((a, b) => a + b, 0) + Math.floor(Math.random() * 10));
    
    setEvaluationResult(finalScore);
    setIsEvaluating(false);
    
    toast({
      title: "Evaluación Completada",
      description: `Score generado: ${finalScore}/100`,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building2 className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Información de la Empresa</h2>
              <p className="text-muted-foreground">Ingrese los datos básicos de su PYME</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nombre de la Empresa</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="Ej: Distribuidora La Esperanza S.A."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  value={formData.ruc}
                  onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                  placeholder="Ej: 1234567890001"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Sector/Industria</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  placeholder="Ej: Comercio al por menor"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Upload className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Documentos Financieros</h2>
              <p className="text-muted-foreground">Suba sus estados financieros y documentos contables</p>
            </div>
            
            <FileUpload 
              onFilesUploaded={(files) => setFormData({...formData, files})}
              maxFiles={10}
            />
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Documentos Requeridos:</h4>
                <ul className="space-y-1">
                  <li>• Estados financieros</li>
                  <li>• Facturas de ventas</li>
                  <li>• Flujo de caja</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Documentos Opcionales:</h4>
                <ul className="space-y-1">
                  <li>• Referencias comerciales</li>
                  <li>• Historial de pagos</li>
                  <li>• Contratos vigentes</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Presencia Digital</h2>
              <p className="text-muted-foreground">Enlaces a redes sociales para análisis de reputación</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="socialMedia">URL Red Social Principal</Label>
                <Input
                  id="socialMedia"
                  value={formData.socialMedia}
                  onChange={(e) => setFormData({...formData, socialMedia: e.target.value})}
                  placeholder="https://facebook.com/mi-empresa"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Facebook, Instagram, LinkedIn o sitio web oficial
                </p>
              </div>
            </div>
            
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="font-medium mb-2">¿Por qué analizamos redes sociales?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Verificamos la presencia digital activa</li>
                <li>• Analizamos reseñas y comentarios de clientes</li>
                <li>• Evaluamos la percepción del mercado</li>
                <li>• Medimos el nivel de engagement y actividad</li>
              </ul>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <BarChart3 className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Evaluación con IA</h2>
              <p className="text-muted-foreground">
                {isEvaluating ? "Analizando datos..." : evaluationResult ? "Evaluación completada" : "Inicie el análisis inteligente"}
              </p>
            </div>
            
            {!isEvaluating && !evaluationResult && (
              <div className="text-center space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Resumen de Datos</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Empresa:</span>
                      <span className="font-medium">{formData.companyName || "No especificado"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Documentos:</span>
                      <span className="font-medium">{formData.files.length} archivos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>RUC:</span>
                      <span className="font-medium">{formData.ruc || "No especificado"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Red Social:</span>
                      <span className="font-medium">{formData.socialMedia ? "✓" : "No especificado"}</span>
                    </div>
                  </div>
                </Card>
                
                <Button 
                  onClick={simulateEvaluation}
                  className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6"
                  size="lg"
                >
                  Iniciar Evaluación IA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
            
            {isEvaluating && (
              <div className="text-center space-y-6">
                <div className="animate-pulse">
                  <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-primary animate-bounce" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Procesando información...</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Analizando documentos financieros</p>
                    <p>• Evaluando presencia digital</p>
                    <p>• Calculando score de riesgo</p>
                  </div>
                </div>
              </div>
            )}
            
            {evaluationResult !== null && (
              <div className="text-center space-y-6">
                <RiskMeter score={evaluationResult} size="lg" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Ver Dashboard Completo
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Descargar Reporte
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                currentStep >= step.number 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-border text-muted-foreground'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  Paso {step.number}
                </p>
                <p className="text-xs text-muted-foreground">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <Separator className="w-12 mx-4 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8 min-h-[500px]">
        {renderStepContent()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={currentStep === 1}
        >
          Anterior
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={currentStep === 4 || (currentStep === 4 && isEvaluating)}
          className="bg-gradient-primary hover:opacity-90"
        >
          {currentStep === 4 ? "Finalizar" : "Siguiente"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EvaluationFlow;