import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, TrendingUp, Users, Database } from "lucide-react";
import heroImage from "@/assets/hero-financial.jpg";
import logo from "@/assets/evalua-pyme-logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Financial Analysis" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="EvaluaPYME" className="w-12 h-12" />
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            EvaluaPYME
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
            Características
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
            Cómo Funciona
          </a>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Iniciar Sesión
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 shadow-medium">
            Soporte
          </Button>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Evaluación de
                <span className="bg-gradient-primary bg-clip-text text-transparent block leading-[1.4]">
                  Riesgo Crediticio
                </span>
                en Tiempo Real
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Plataforma inteligente que evalúa el riesgo crediticio de PYMEs ecuatorianas 
                usando datos financieros reales y análisis de redes sociales con IA avanzada.
              </p>
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-medium text-lg px-8 py-4">
                Comenzar Evaluación
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4">
                Ver Demo
              </Button>
            </div> */}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Precisión IA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">30s</div>
                <div className="text-sm text-muted-foreground">Tiempo Evaluación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">PYMEs Evaluadas</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-soft bg-white/80 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Análisis Seguro</h3>
                  <p className="text-muted-foreground">
                    Procesamiento cifrado de datos financieros con estándares bancarios de seguridad.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-soft bg-white/80 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-success rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Scoring Inteligente</h3>
                  <p className="text-muted-foreground">
                    Algoritmos de IA que evalúan más de 50 variables para generar un score preciso.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-soft bg-white/80 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-warning rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Reputación Digital</h3>
                  <p className="text-muted-foreground">
                    Análisis de sentimiento en redes sociales para evaluar la percepción del mercado.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-soft bg-white/80 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary rounded-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Datos Oficiales</h3>
                  <p className="text-muted-foreground">
                    Integración con Superintendencia de Compañías de Ecuador para datos verificados.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;