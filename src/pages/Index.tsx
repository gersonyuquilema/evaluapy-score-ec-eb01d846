import { useState } from "react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import EvaluationFlow from "@/components/EvaluationFlow";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "evaluation" | "dashboard">("home");

  const renderCurrentView = () => {
    switch (currentView) {
      case "evaluation":
        return (
          <div className="min-h-screen bg-background pt-6">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView("home")}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  ← Volver al Inicio
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView("dashboard")}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Ver Dashboard Demo
                </Button>
              </div>
              <EvaluationFlow />
            </div>
          </div>
        );
      case "dashboard":
        return (
          <div className="min-h-screen bg-background pt-6">
            <div className="max-w-7xl mx-auto px-6 mb-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("home")}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                ← Volver al Inicio
              </Button>
            </div>
            <Dashboard />
          </div>
        );
      default:
        return (
          <div>
            <Hero />
            <div className="py-16 text-center">
              <div className="max-w-4xl mx-auto px-6 space-y-8">
                <h2 className="text-3xl font-bold">Comience su Evaluación</h2>
                <p className="text-xl text-muted-foreground">
                  Pruebe nuestra demo interactiva para ver cómo funciona EvaluaPYME
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => setCurrentView("evaluation")}
                    className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-4"
                  >
                    Iniciar Demo de Evaluación
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => setCurrentView("dashboard")}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4"
                  >
                    Ver Dashboard Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderCurrentView();
};

export default Index;
