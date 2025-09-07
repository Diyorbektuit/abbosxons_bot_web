import { Card } from "@/components/ui/card";

interface BalanceCardProps {
  label: string;
  amount: string;
  currency?: string;
}

export const BalanceCard = ({ label, amount, currency }: BalanceCardProps) => {
  return (
    <Card className="p-8 bg-gradient-card shadow-lg border-0 relative overflow-hidden animate-fade-in">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/3 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="space-y-3 relative z-10">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-foreground tracking-tight">{amount}</span>
          {currency && <span className="text-xl text-muted-foreground font-medium">{currency}</span>}
        </div>
      </div>
    </Card>
  );
};