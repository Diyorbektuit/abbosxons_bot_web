import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  icon: LucideIcon;
  title: string;
  onClick?: () => void;
  className?: string;
}

export const MenuItem = ({ icon: Icon, title, onClick, className }: MenuItemProps) => {
  return (
    <Card className={cn("p-0 bg-card shadow-card border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-200 hover:scale-[1.02] group", className)}>
      <Button 
        variant="ghost" 
        className="w-full h-auto p-5 justify-between text-left font-normal hover:bg-transparent group-hover:bg-accent/30"
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200">
            <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
          </div>
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
      </Button>
    </Card>
  );
};