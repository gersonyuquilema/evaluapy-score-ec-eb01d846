import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import RiskMeter from "./RiskMeter";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign, Users, BarChart3, Shield } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DashboardProps {
  companyName?: string;
  riskScore?: number;
  financialData?: {
    sales: number;
    liquidity: number;
    profitability: number;
    reputation: number;
  };
}

const Dashboard = ({ 
  companyName = "Mi Empresa PYME",
  riskScore = 73,
  financialData = {
    sales: 85,
    liquidity: 68,
    profitability: 71,
    reputation: 79
  }
}: DashboardProps) => {
  
  const creditRecommendation = riskScore >= 80 
    ? { amount: 50000, status: "approved", color: "success" }
    : riskScore >= 50 
    ? { amount: 25000, status: "review", color: "warning" }
    : { amount: 0, status: "denied", color: "destructive" };

  const kpis = [
    {
      label: "Ventas Mensuales",
      value: "$45,230",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign
    },
    {
      label: "Liquidez",
      value: "68%",
      change: "-3.2%",
      trend: "down",
      icon: BarChart3
    },
    {
      label: "Clientes Activos",
      value: "156",
      change: "+8.1%",
      trend: "up",
      icon: Users
    },
    {
      label: "Score Reputación",
      value: "79/100",
      change: "+5.3%",
      trend: "up",
      icon: Shield
    }
  ];

  const dashboardRef = useRef<HTMLDivElement>(null);
  const reportBtnRef = useRef<HTMLButtonElement>(null);
  const riskMeterRef = useRef<HTMLDivElement>(null); // <--- agrega este ref

  const handleGenerateReport = async () => {
    if (!dashboardRef.current) return;
    // Oculta el botón antes de capturar
    if (reportBtnRef.current) {
      reportBtnRef.current.style.display = "none";
    }
    // Asegura que todo esté visible y renderizado
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Captura el dashboard como imagen con mayor escala
    const canvas = await html2canvas(dashboardRef.current, { scale: 3, useCORS: true, backgroundColor: "#fff" });
    const imgData = canvas.toDataURL("image/png");
    // Muestra el botón de nuevo
    if (reportBtnRef.current) {
      reportBtnRef.current.style.display = "";
    }
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("reporte_crediticio.pdf");
  };

  return (
    <div ref={dashboardRef} className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{companyName}</h1>
          <p className="text-muted-foreground">Dashboard de Evaluación Crediticia</p>
        </div>
        <Button
          ref={reportBtnRef}
          className="bg-gradient-primary hover:opacity-90"
          onClick={handleGenerateReport}
        >
          Generar Reporte
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Score - Main */}
        <div className="lg:col-span-1" ref={riskMeterRef}>
          <RiskMeter score={riskScore} size="lg" className="h-fit" />
        </div>

        {/* KPIs Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-primary" />
                <span className={`text-sm flex items-center ${
                  kpi.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {kpi.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Financial Indicators */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Indicadores Financieros</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Ventas</span>
              <span className="text-sm text-muted-foreground">{financialData.sales}%</span>
            </div>
            <Progress value={financialData.sales} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Liquidez</span>
              <span className="text-sm text-muted-foreground">{financialData.liquidity}%</span>
            </div>
            <Progress value={financialData.liquidity} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Rentabilidad</span>
              <span className="text-sm text-muted-foreground">{financialData.profitability}%</span>
            </div>
            <Progress value={financialData.profitability} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Reputación Digital</span>
              <span className="text-sm text-muted-foreground">{financialData.reputation}%</span>
            </div>
            <Progress value={financialData.reputation} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Credit Recommendation */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {creditRecommendation.status === "approved" && <CheckCircle className="h-6 w-6 text-success" />}
            {creditRecommendation.status === "review" && <AlertCircle className="h-6 w-6 text-warning" />}
            {creditRecommendation.status === "denied" && <AlertCircle className="h-6 w-6 text-destructive" />}
            <h3 className="text-xl font-semibold">Recomendación de Crédito</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Monto Máximo Recomendado</p>
              <p className="text-3xl font-bold text-primary">
                ${creditRecommendation.amount.toLocaleString()}
              </p>
            </div>
            <div className={`p-4 rounded-lg border-l-4 ${
              creditRecommendation.status === "approved" 
                ? "bg-success/10 border-success text-success-foreground" 
                : creditRecommendation.status === "review"
                ? "bg-warning/10 border-warning text-warning-foreground"
                : "bg-destructive/10 border-destructive text-destructive-foreground"
            }`}>
              <p className="font-medium">
                {creditRecommendation.status === "approved" && "✅ Crédito Aprobado"}
                {creditRecommendation.status === "review" && "⚠️ Requiere Revisión"}
                {creditRecommendation.status === "denied" && "❌ Crédito No Recomendado"}
              </p>
              <p className="text-sm mt-1 opacity-90">
                {creditRecommendation.status === "approved" && "Su empresa cumple con los requisitos para obtener financiamiento."}
                {creditRecommendation.status === "review" && "Se requiere análisis adicional para determinar elegibilidad."}
                {creditRecommendation.status === "denied" && "Mejore los indicadores financieros antes de solicitar crédito."}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Simulador "¿Qué pasaría si...?"</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Si aumenta ventas 20%:</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nuevo Score:</span>
                <span className="font-bold text-success">79 (+6)</span>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Si mejora reputación digital:</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nuevo Score:</span>
                <span className="font-bold text-success">76 (+3)</span>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Si reduce deudas 30%:</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nuevo Score:</span>
                <span className="font-bold text-success">81 (+8)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;