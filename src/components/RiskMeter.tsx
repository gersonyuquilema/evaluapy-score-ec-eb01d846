import { useMemo } from "react";
import { Card } from "@/components/ui/card";

interface RiskMeterProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RiskMeter = ({ score, size = "md", className = "" }: RiskMeterProps) => {
  const dimensions = {
    sm: { size: 120, strokeWidth: 8, fontSize: "text-lg" },
    md: { size: 180, strokeWidth: 12, fontSize: "text-3xl" },
    lg: { size: 240, strokeWidth: 16, fontSize: "text-4xl" }
  };

  const { size: meterSize, strokeWidth, fontSize } = dimensions[size];
  const radius = (meterSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = meterSize / 2;

  const { color, label, bgColor } = useMemo(() => {
    if (score >= 80) {
      return {
        color: "hsl(var(--success))",
        label: "Bajo Riesgo",
        bgColor: "hsl(var(--success) / 0.1)"
      };
    } else if (score >= 50) {
      return {
        color: "hsl(var(--warning))",
        label: "Riesgo Medio",
        bgColor: "hsl(var(--warning) / 0.1)"
      };
    } else {
      return {
        color: "hsl(var(--destructive))",
        label: "Alto Riesgo",
        bgColor: "hsl(var(--destructive) / 0.1)"
      };
    }
  }, [score]);

  // Calculate stroke offset for the progress
  const strokeDasharray = circumference * 0.75; // 270 degrees (3/4 of circle)
  const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;

  const startAngle = 135; // Start at 135 degrees (bottom left)
  const endAngle = 45; // End at 45 degrees (bottom right)

  return (
    <Card className={`p-6 ${className}`} style={{ backgroundColor: bgColor }}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <svg
            width={meterSize}
            height={meterSize}
            className="transform -rotate-45"
          >
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={0}
              strokeLinecap="round"
              className="opacity-20"
            />
            
            {/* Progress track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${color}40)`
              }}
            />
          </svg>
          
          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-bold ${fontSize}`} style={{ color }}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>
        
        {/* Risk level label */}
        <div className="text-center">
          <div className="font-semibold text-lg" style={{ color }}>
            {label}
          </div>
          <div className="text-sm text-muted-foreground">
            Puntaje de Riesgo Crediticio
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RiskMeter;