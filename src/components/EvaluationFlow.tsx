import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import FileUpload from "@/components/FileUpload";
import RiskMeter from "./RiskMeter";
import { Building2, Globe, Upload, BarChart3, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [showDashboard, setShowDashboard] = useState(false);
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

  const handleDescargarReporte = () => {
    const doc = new jsPDF();

    // Colores y estilos
    const azul = "#1a237e";
    const gris = "#f5f5f5";
    const naranja = "#ff9800";
    const verde = "#43a047";
    const amarillo = "#fbc02d";

    // Encabezado
    doc.setFillColor(26, 35, 126); // azul
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(formData.companyName || "Mi Empresa PYME", 12, 18);
    doc.setFontSize(10);
    doc.text("Reporte de Evaluación Crediticia", 12, 25);

    // Datos principales
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`RUC: ${formData.ruc || "No especificado"}`, 12, 38);
    doc.text(`Industria: ${formData.industry || "No especificado"}`, 12, 46);
    doc.text(`Red Social: ${formData.socialMedia || "No especificado"}`, 12, 54);

    // Score y riesgo
    const score = evaluationResult ?? 0;
    const riesgo = score >= 80 ? "BAJO" : score >= 60 ? "MEDIO" : "ALTO";
    const colorRiesgo = score >= 80 ? verde : score >= 60 ? amarillo : naranja;

    // Score visual
    doc.setDrawColor(colorRiesgo);
    doc.setLineWidth(1.5);
    doc.circle(180, 45, 18, "S");
    doc.setFontSize(22);
    doc.setTextColor(colorRiesgo);
    doc.text(`${score}`, 180, 50, { align: "center" });
    doc.setFontSize(10);
    doc.text("SCORE", 180, 58, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Riesgo
    doc.setFontSize(14);
    doc.setTextColor(colorRiesgo);
    doc.text(`RIESGO ${riesgo}`, 12, 70);
    doc.setTextColor(0, 0, 0);

    // Indicadores principales (como tarjetas)
    autoTable(doc, {
      startY: 78,
      theme: "plain",
      styles: { fontSize: 11, cellPadding: 3 },
      body: [
        [
          { content: "Ventas Mensuales", styles: { fillColor: gris } },
          { content: "$45,230", styles: { textColor: azul, fontStyle: "bold" } },
          { content: "Liquidez", styles: { fillColor: gris } },
          { content: "68%", styles: { textColor: azul, fontStyle: "bold" } },
        ],
        [
          { content: "Clientes Activos", styles: { fillColor: gris } },
          { content: "156", styles: { textColor: azul, fontStyle: "bold" } },
          { content: "Reputación Digital", styles: { fillColor: gris } },
          { content: "79/100", styles: { textColor: azul, fontStyle: "bold" } },
        ],
      ],
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35 },
        2: { cellWidth: 40 },
        3: { cellWidth: 35 },
      },
    });

    // Indicadores Financieros (barras)
    let y = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 10
      : 100;
    doc.setFontSize(12);
    doc.text("Indicadores Financieros", 12, y);
    y += 6;

    const indicadores = [
      { nombre: "Ventas", valor: 85 },
      { nombre: "Liquidez", valor: 68 },
      { nombre: "Rentabilidad", valor: 71 },
      { nombre: "Reputación Digital", valor: 79 },
    ];

    indicadores.forEach((ind, i) => {
      doc.setFontSize(10);
      doc.text(`${ind.nombre}: ${ind.valor}%`, 15, y + i * 8);
      // Barra
      doc.setFillColor(azul);
      doc.rect(45, y - 3 + i * 8, ind.valor * 1.2, 5, "F");
      doc.setFillColor(gris);
      doc.rect(45 + ind.valor * 1.2, y - 3 + i * 8, (100 - ind.valor) * 1.2, 5, "F");
    });

    // Recomendación de crédito
    y += indicadores.length * 8 + 8;
    doc.setFontSize(12);
    doc.text("Recomendación de Crédito", 12, y);
    doc.setFontSize(14);
    doc.setTextColor(azul);
    doc.text("$25,000", 70, y);
    doc.setFontSize(10);
    doc.setTextColor(naranja);
    doc.text([
      "⚠️ Requiere Revisión:",
      "Se requiere análisis adicional para determinar elegibilidad."
    ], 12, y + 8);
    doc.setTextColor(0, 0, 0);

    // Simulador
    y += 20;
    doc.setFontSize(12);
    doc.text('Simulador "¿Qué pasaría si...?"', 12, y);
    doc.setFontSize(10);
    doc.text(`Si aumenta ventas 20%: ${score + 6} (+6)`, 15, y + 8);
    doc.text(`Si mejora reputación digital: ${score + 3} (+3)`, 15, y + 16);
    doc.text(`Si reduce deudas 30%: ${score + 8} (+8)`, 15, y + 24);

    // Documentos cargados
    y += 34;
    doc.setFontSize(12);
    doc.text("Documentos Financieros Cargados:", 12, y);
    doc.setFontSize(10);
    if (formData.files.length > 0) {
      formData.files.forEach((file, idx) => {
        doc.text(`• ${file.name}`, 15, y + 8 + idx * 6);
      });
    } else {
      doc.text("No se han subido documentos.", 15, y + 8);
    }

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Reporte generado automáticamente por Evaluapy", 12, 290);

    doc.save(`reporte_${formData.companyName || "empresa"}.pdf`);
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
              nombreEmpresa={formData.companyName}
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
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setShowDashboard(true)}
                  >
                    Ver Dashboard Completo
                  </Button>
                  <Button 
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={handleDescargarReporte}
                  >
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

  if (showDashboard) {
    // Simulaciones de datos para los indicadores (puedes ajustar según tu lógica real)
    const ventas = 45230;
    const liquidez = 68;
    const rentabilidad = 71;
    const reputacionDigital = 79;
    const clientesActivos = 156;
    const variacionVentas = 12.5;
    const variacionClientes = 8.1;
    const variacionLiquidez = -3.2;
    const variacionReputacion = 5.3;
    const montoCredito = "$25,000";

    // Score y riesgo
    const score = evaluationResult ?? 0;
    const riesgo = score >= 80 ? "Bajo" : score >= 60 ? "Medio" : "Alto";
    const colorRiesgo = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
    const textoRiesgo = score >= 80 ? "Bajo Riesgo" : score >= 60 ? "Riesgo Medio" : "Riesgo Alto";

    return (
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-1">{formData.companyName || "Mi Empresa PYME"}</h2>
        <p className="text-muted-foreground mb-6">Dashboard de Evaluación Crediticia</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Score principal */}
          <div className="col-span-1 flex flex-col items-center justify-center bg-yellow-50 rounded-lg p-6">
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="50" stroke="#f3f4f6" strokeWidth="12" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={colorRiesgo}
                strokeWidth="12"
                fill="none"
                strokeDasharray={314}
                strokeDashoffset={314 - (score / 100) * 314}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s" }}
              />
              <text x="60" y="70" textAnchor="middle" fontSize="32" fill={colorRiesgo} fontWeight="bold">
                {score}
              </text>
            </svg>
            <div className="mt-2 text-lg font-semibold">{textoRiesgo}</div>
            <div className="text-xs text-muted-foreground">Puntaje de Riesgo Crediticio</div>
          </div>
          {/* Indicadores */}
          <div className="col-span-1 bg-white rounded-lg p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center text-blue-600 font-bold text-xl">${ventas.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Ventas Mensuales</div>
            <div className="text-green-500 text-xs mt-1">{variacionVentas > 0 ? `▲ +${variacionVentas}%` : `▼ ${variacionVentas}%`}</div>
          </div>
          <div className="col-span-1 bg-white rounded-lg p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center font-bold text-xl">{liquidez}%</div>
            <div className="text-xs text-muted-foreground">Liquidez</div>
            <div className={`${variacionLiquidez > 0 ? "text-green-500" : "text-red-500"} text-xs mt-1`}>
              {variacionLiquidez > 0 ? `▲ +${variacionLiquidez}%` : `▼ ${Math.abs(variacionLiquidez)}%`}
            </div>
          </div>
          <div className="col-span-1 bg-white rounded-lg p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center font-bold text-xl">{clientesActivos}</div>
            <div className="text-xs text-muted-foreground">Clientes Activos</div>
            <div className="text-green-500 text-xs mt-1">{variacionClientes > 0 ? `▲ +${variacionClientes}%` : `▼ ${variacionClientes}%`}</div>
          </div>
        </div>
        {/* Indicadores Financieros */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h4 className="font-semibold mb-4">Indicadores Financieros</h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Ventas</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Liquidez</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${liquidez}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Rentabilidad</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${rentabilidad}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Reputación Digital</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${reputacionDigital}%` }} />
              </div>
            </div>
          </div>
        </div>
        {/* Recomendación de crédito y simulador */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold mb-2">Recomendación de Crédito</h4>
            <div className="text-2xl font-bold text-blue-700 mb-2">{montoCredito}</div>
            <div className="bg-yellow-100 text-yellow-800 rounded p-2 text-xs flex items-center">
              ⚠️ Requiere Revisión: Se requiere análisis adicional para determinar elegibilidad.
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold mb-2">Simulador "¿Qué pasaría si...?"</h4>
            <ul className="text-sm space-y-2">
              <li>
                Si aumenta ventas 20%: <span className="font-bold text-green-600">{score + 6} (+6)</span>
              </li>
              <li>
                Si mejora reputación digital: <span className="font-bold text-green-600">{score + 3} (+3)</span>
              </li>
              <li>
                Si reduce deudas 30%: <span className="font-bold text-green-600">{score + 8} (+8)</span>
              </li>
            </ul>
          </div>
        </div>
        <Button onClick={() => setShowDashboard(false)}>Volver</Button>
      </div>
    );
  }

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