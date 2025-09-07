import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { MenuItem } from "@/components/MenuItem";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AdminContactCard } from "@/components/AdminContact";

import { 
  Edit3, 
  CreditCard, 
  FileText, 
  HelpCircle, 
  MessageCircle,
  CheckCircle,
  Wallet,
  Calendar,
  ChevronDown,
  Clock,
  ExternalLink,
  Upload,
  FileImage
} from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ContactMenuItem } from "@/components/ContackMenuItem";
import PaymentCard from "@/components/PaymentCart";

type Page = "dashboard" | "subscription" | "card-input" | "profile" | "payment-history" | "faq";

interface UserProfile {
  is_subscribed: string;
  rest_of_days: number;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Transaction {
  amount: string;
  created_at: string;
}

interface TransactionHistory {
  count: number;
  next: string | null;
  previous: string | null;
  results: Transaction[];
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [paginationPage, setPaginationPage] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [showPaymentUpload, setShowPaymentUpload] = useState(false);
  

  // Extract API key from URL parameters
  const getApiKeyFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('x_api_key');
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    const apiKey = getApiKeyFromUrl();
    
    if (!apiKey) {
      setError("Siz hali ro'yhatdan o'tmagansiz");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://abbosxons-bot.xazratqulov.uz/api/common/profile/me/', {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setError("Siz hali ro'yhatdan o'tmagansiz");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('API xatolik');
      }

      const data: UserProfile = await response.json();
      setUserProfile(data);
      setError(null);
    } catch (err) {
      setError("Siz hali ro'yhatdan o'tmagansiz");
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchFAQs = async () => {
    setFaqLoading(true);
    try {
      const response = await fetch('https://abbosxons-bot.xazratqulov.uz/api/common/extra/faq/');
      
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error('FAQ fetch error:', error);
    } finally {
      setFaqLoading(false);
    }
  };

  const fetchTransactionHistory = async (page: number = 1) => {
    const apiKey = getApiKeyFromUrl();
    
    if (!apiKey) {
      return;
    }

    setTransactionLoading(true);
    try {
      const response = await fetch(`https://abbosxons-bot.xazratqulov.uz/api/common/profile/transaction-history/?page=${page}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data: TransactionHistory = await response.json();
        setTransactions(data.results);
        setTransactionCount(data.count);
      }
    } catch (error) {
      console.error('Transaction history fetch error:', error);
    } finally {
      setTransactionLoading(false);
    }
  };


  // Fetch subcription price 
  const [subscriptionPrice, setSubscriptionPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://abbosxons-bot.xazratqulov.uz/api/common/extra/main-settings/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.main_subscription_price) {
          setSubscriptionPrice(data.main_subscription_price);
        }
      })
      .catch((err) => console.error("Narxni olishda xato:", err));
  }, []);


  // Upload payment receipt function
  const uploadPaymentReceipt = async () => {
    const apiKey = getApiKeyFromUrl();
    
    if (!apiKey || !paymentReceipt) {
      setUploadMessage("API kalit yoki fayl topilmadi");
      return;
    }

    setUploadLoading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append('payment_check', paymentReceipt);

      const response = await fetch('https://abbosxons-bot.xazratqulov.uz/api/common/profile/payment-check/', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
        },
        body: formData
      });

      if (response.status === 201) {
        setUploadMessage("To'lov cheki muvaffaqiyatli yuborildi! Tekshirish uchun kutib turing.");
        setPaymentReceipt(null);
        // Reset file input
        const fileInput = document.getElementById('payment-receipt') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else if (response.status === 400) {
        const errorData = await response.json();
        setUploadMessage(errorData.non_field_errors?.[0] || "Xatolik yuz berdi");
      } else {
        setUploadMessage("Server xatoligi yuz berdi");
      }
    } catch (error: any) {
      setUploadMessage(`Tarmoq xatoligi: ${error.message || error.toString()}`);
    
    } finally {
      setUploadLoading(false);
    }
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setPaginationPage(1);
    
    if (page === "faq" && faqs.length === 0) {
      fetchFAQs();
    }
    
    if (page === "payment-history") {
      fetchTransactionHistory(1);
    }
  };

 const handleBack = () => {
    if (currentPage === "card-input") {
      setCurrentPage("subscription");
    } else {
      setCurrentPage("dashboard");
    }
    setCurrentPage("dashboard");
  };

  const renderDashboard = () => {
    // Show error message if API key is missing or API returns 401
    if (error) {
      return (
        <div className="min-h-screen bg-background">
          <Header title="Creators Pro" showBack={false} />
          
          <div className="p-4 space-y-4">
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Xatolik yuz berdi</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-background">
          <Header title="Creators Pro" showBack={false} />
          
          <div className="p-4 space-y-4">
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Ma'lumotlar yuklanmoqda...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header title="Creators Pro" showBack={false} />
        
        <div className="p-4 space-y-4">
          {userProfile?.rest_of_days !== 0 && (
          <BalanceCard 
            label="Obuna tugashiga"
            amount={userProfile?.rest_of_days?.toString() || "0"}
            currency="kun"
          />
        )}

          {/* Payment Receipt Upload - Only show if not subscribed */}
            {userProfile && 
              (userProfile.is_subscribed === "no_subscribed" || userProfile.is_subscribed === "expired") && (
                <Card className="p-8 bg-gradient-warning border-0 shadow-lg relative overflow-hidden animate-scale-in">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full" />
                  
                  <div className="text-center space-y-6 relative z-10">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-warning-foreground">
                        {userProfile.is_subscribed === "expired" 
                          ? "Obunani yangilaysizmi?" 
                          : "Yopiq community qo'shilish"}
                      </h3>
                    </div>
                    
                    <Button 
                      variant="outline"
                      className="bg-white text-warning px-8 py-3 rounded-2xl font-semibold hover:bg-white/90"
                      onClick={() => handleNavigation("subscription")}
                    >
                      Qo'shilish
                    </Button>
                  </div>
                </Card>
            )}


          <div className="space-y-3">
            {/* Commented out for version 1
            <MenuItem 
              icon={Edit3} 
              title="Ma'lumotlarni o'zgartirish"
              onClick={() => handleNavigation("profile")}
            />
            */}
            <MenuItem 
              icon={CreditCard} 
              title="To'lovlar tarixi"
              onClick={() => handleNavigation("payment-history")}
            />
            {/* Commented out for version 1
            <MenuItem 
              icon={FileText} 
              title="Shartnoma"
              onClick={() => {}}
            />
            */}
            <MenuItem 
              icon={HelpCircle} 
              title="FAQ"
              onClick={() => handleNavigation("faq")}
            />
            <ContactMenuItem />
          </div>
        </div>
      </div>
    );
  };

const renderSubscription = () => (
  <div className="min-h-screen bg-background">
    <Header title="Creators Pro" showBack={true} onBack={handleBack} />
    
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <p className="text-muted-foreground font-medium">Obuna narxi</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-foreground tracking-tight">
              {subscriptionPrice ? subscriptionPrice.toLocaleString("uz-UZ") : "…"}
            </span>
            <span className="text-xl text-muted-foreground font-medium">UZS</span>
          </div>
        </div>
      </div>

      <Card className="p-8 bg-gradient-card shadow-lg border-0 relative overflow-hidden">
  {/* Decorative background */}
  <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full -translate-y-12 translate-x-12" />

      <div className="space-y-6 relative z-10">
        <h3 className="text-2xl font-bold text-foreground">Creators Pro</h3>

        <div className="space-y-4">
          {[
            "Eng so'nggi va trentdagi soundlar",
            "Lightroom presetlar (2 ta)",
            "Pulli LUTlar (2 ta)",
            "Colorgrading bo'yicha videodarslik (1 ta)",
            "Ishni tezlashtiruvchi videodarsliklar (2 ta)",
            "Jonli efirlar (2 ta)",
            "Vakansiyalar",
            "Bir martalik ishlar",
            "Production jamoamizga qo'shilish imkoniyati",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <p className="text-foreground text-base leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>

      {/* Static karta raqami (admin kartasi) */}
      <PaymentCard />

      {/* Chek yuklash joyi */}
        <Card className="p-4 border-2 border-dashed border-gray-300 bg-white rounded-lg shadow-sm">
          <div className="space-y-2">
            <Label className="font-medium text-gray-700 text-sm">To‘lov chekini yuklang</Label>
            
            <Label htmlFor="payment-receipt" className="cursor-pointer w-full">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center space-y-2">
                  {paymentReceipt ? (
                    <>
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <FileImage className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-800 text-sm font-medium truncate max-w-[180px]">
                          {paymentReceipt.name}
                        </p>
                        <p className="text-gray-500 text-xs">Fayl tanlandi</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 text-sm font-medium">Chekni yuklang</p>
                        <p className="text-gray-500 text-xs">JPG, PNG formatlar</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Label>

            <Input
              id="payment-receipt"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPaymentReceipt(file);
              }}
            />
          </div>

          {uploadMessage && (
            <div
              className={`text-xs p-2 mt-2 rounded-md ${
                uploadMessage.includes("muvaffaqiyatli")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {uploadMessage}
            </div>
          )}
        </Card>


      <PrimaryButton 
        onClick={uploadPaymentReceipt} 
        disabled={!paymentReceipt || uploadLoading}
      >
        {uploadLoading ? "Yuklanmoqda..." : "Tasdiqlash"}
      </PrimaryButton>
    </div>
  </div>
);


  const renderCardInput = () => (
    <div className="min-h-screen bg-background">
      <Header title="Parallel Muhit" showBack={true} onBack={handleBack} />
      
      <div className="p-4 space-y-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Bank kartasi ma'lumotlarini kiriting</h2>
          
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">Karta raqami</label>
              <Input 
                placeholder="0000 0000 0000 0000" 
                className="text-lg py-7 rounded-2xl border-2 focus:border-primary/50 transition-all duration-200 bg-card-accent"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">Amal qilish muddati</label>
              <Input 
                placeholder="MM/YY" 
                className="text-lg py-7 rounded-2xl border-2 focus:border-primary/50 transition-all duration-200 bg-card-accent"
              />
            </div>
          </div>
        </div>

        <Card className="p-6 bg-gradient-secondary border-0 shadow-card">
          <div className="text-center text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>Xavfsizlik maqsadida sizning bank kartangiz</p>
            <p>ma'lumotlari Click xizmatining serverlarida</p>
            <p>saqlanadi. Sizning shaxsingizga oid hech qanday</p>
            <p>ma'lumot saqlamaydi. <span className="text-primary underline font-medium">Click ofertasi</span></p>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-sm text-muted-foreground font-medium">Powered by</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm">
                <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
              </div>
              <span className="font-bold text-primary text-lg">click</span>
            </div>
          </div>
        </Card>

        <PrimaryButton>
          Kodini olish
        </PrimaryButton>
      </div>
    </div>
  );


  const renderPaymentHistory = () => {
    const paymentsPerPage = 10;
    const totalPages = Math.ceil(transactionCount / paymentsPerPage);

    const handlePageChange = (page: number) => {
      setPaginationPage(page);
      fetchTransactionHistory(page);
    };

    // Format date function
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    };

    return (
      <div className="min-h-screen bg-background">
        <Header title="To'lovlar tarixi" showBack={true} onBack={handleBack} />
        
        <div className="p-4 space-y-4">
          {transactionLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">To'lovlar tarixi yuklanmoqda...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">To'lovlar topilmadi</h3>
                <p className="text-muted-foreground">Hozircha hech qanday to'lov amalga oshirilmagan</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Muvaffaqiyatli</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{parseFloat(transaction.amount).toLocaleString()} UZS</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, paginationPage - 1))}
                          className={paginationPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (paginationPage <= 3) {
                          page = i + 1;
                        } else if (paginationPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = paginationPage - 2 + i;
                        }
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === paginationPage}
                              onClick={() => handlePageChange(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, paginationPage + 1))}
                          className={paginationPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

const renderFAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header title="FAQ" showBack={true} onBack={handleBack} />
      
      <div className="p-4 space-y-4">
        {faqLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">FAQ ma'lumotlari yuklanmoqda...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger asChild>
                  <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground text-left">{faq.question}</h3>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2 p-4 bg-muted/30">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
        <AdminContactCard />
      </div>
    </div>
  );
};

  // Show dashboard by default
  React.useEffect(() => {
    setCurrentPage("dashboard");
  }, []);

  switch (currentPage) {
    case "dashboard":
      return renderDashboard();
    case "payment-history":
      return renderPaymentHistory();
    case "faq":
      return renderFAQ();
    case "subscription":
      return renderSubscription();
    default:
      return renderDashboard();
  }
};

export default Index;