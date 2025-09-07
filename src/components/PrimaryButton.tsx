import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  size?: "default" | "sm" | "lg";
}

export const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled, 
  className,
  type = "button",
  size = "default"
}: PrimaryButtonProps) => {
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full bg-gradient-primary hover:shadow-button-hover text-primary-foreground font-semibold py-6 rounded-2xl shadow-button transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group",
        className
      )}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      <span className="relative z-10">{children}</span>
    </Button>
  );
};