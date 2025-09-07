// src/components/PaymentCard.tsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface MainSettings {
  id: number;
  main_subscription_price: number;
  admin: string;
  card_number: string;
  card_holder: string;
}

export default function PaymentCard() {
  const [settings, setSettings] = useState<MainSettings | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("https://abbosxons-bot.xazratqulov.uz/api/common/extra/main-settings/")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setSettings(data);
      })
      .catch((err) => {
        console.error("API dan ma'lumot olishda xato:", err);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <Card className="p-6 bg-gray-800 text-white shadow-lg rounded-xl">
      {settings ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-wider opacity-80">Karta raqami</p>
            <p className="text-2xl font-bold tracking-widest">{settings.card_number}</p>
          </div>
          <div className="flex justify-between items-center text-sm opacity-90">
            <span>{settings.card_holder}</span>
            <span className="text-xs opacity-60">Creaters.uz</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-300">Karta ma'lumotlari yuklanmoqda...</p>
      )}
    </Card>
  );
}
