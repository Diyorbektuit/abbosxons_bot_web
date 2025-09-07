import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { MenuItem } from "@/components/MenuItem";

export const ContactMenuItem = () => {
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
    <MenuItem 
      icon={MessageCircle} 
      title="Aloqa"
      onClick={() => admin && window.open(`https://t.me/${admin}`, "_blank")}
    />
  );
};
