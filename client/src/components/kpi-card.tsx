import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  gradient?: string;
}

export function KPICard({ title, value, icon: Icon, trend, className, gradient }: KPICardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)} data-testid={`card-kpi-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {gradient && (
        <div className="absolute inset-0 opacity-5" style={{ background: gradient }} />
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold font-mono">{value}</p>
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.isPositive ? "text-primary" : "text-destructive"
              )}>
                <span>{trend.isPositive ? "↑" : "↓"}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
