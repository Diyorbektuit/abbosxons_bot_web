// src/components/PaymentCard.tsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CreditCard, Copy } from "lucide-react";

interface MainSettings {
  id: number;
  main_subscription_price: number;
  admin: string;
  card_number: string;
  card_holder: string;
}

export default function PaymentCard() {
  const [settings, setSettings] = useState<MainSettings | null>(null);
  const [copied, setCopied] = useState(false);

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
    return () => {
      mounted = false;
    };
  }, []);

  // karta raqamini formatlash
  const formatCardNumber = (num: string) =>
    num.replace(/(\d{4})(?=\d)/g, "$1 ").trim();

  const handleCopy = () => {
    if (settings?.card_number) {
      navigator.clipboard.writeText(settings.card_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Card className="relative h-52 w-full md:w-[400px] rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 text-white p-6">
      {settings ? (
        <div className="flex flex-col h-full justify-between">
          {/* Yuqori qismi */}
          <div className="flex justify-between items-start">
            {/* Chip */}
            <div className="w-12 h-8 bg-yellow-300 rounded-md shadow-inner"></div>
            {/* Logo / belgi */}
            <CreditCard className="h-8 w-8 opacity-80" />
          </div>

          {/* Karta raqami */}
          <div
            className="flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl font-mono tracking-wide md:tracking-widest text-center cursor-pointer select-none transition active:scale-95"
            onClick={handleCopy}
          >
            <span>{formatCardNumber(settings.card_number)}</span>
            <Copy className="h-5 w-5 opacity-80" />
          </div>
          {copied && (
            <p className="text-xs text-green-300 text-center animate-fadeIn">
              Nusxalandi!
            </p>
          )}

          {/* Pastki qismi */}
          <div className="flex justify-between items-center text-sm">
            <span className="uppercase tracking-wide font-semibold">
              {settings.card_holder}
            </span>
            <span className="text-xs opacity-80 font-medium">Creators Pro</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-200 text-sm">Karta ma'lumotlari yuklanmoqda...</p>
        </div>
      )}
    </Card>
  );
}
