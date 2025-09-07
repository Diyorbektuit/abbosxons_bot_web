import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header = ({ title, showBack = false, onBack }: HeaderProps) => {
  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
      {showBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="h-8 w-8 rounded-lg hover:bg-accent transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <h1 className="text-lg font-medium text-foreground truncate">{title}</h1>
    </header>
  );
};