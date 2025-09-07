import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const AdminContactCard = () => {
  const [admin, setAdmin] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://abbosxons-bot.xazratqulov.uz/api/common/extra/main-settings/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.admin) {
          setAdmin(data.admin);
        }
      })
      .catch((err) => console.error("Adminni olishda xato:", err));
  }, []);

  return (
    <Card className="p-6 bg-gradient-card border-0 shadow-lg">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Savolingiz topilamadimi?</h3>
        <p className="text-muted-foreground">Bizning admin bilan bog'laning</p>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => admin && window.open(`https://t.me/${admin}`, "_blank")}
          disabled={!admin}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Admin bilan bog'lanish
        </Button>
      </div>
    </Card>
  );
};
