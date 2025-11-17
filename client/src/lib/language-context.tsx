import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ta";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation & Common
  "dashboard": { en: "Dashboard", ta: "கட்டுப்பாட்டு பலகை" },
  "attendance": { en: "Attendance", ta: "வருகைப் பதிவு" },
  "cultivation": { en: "Cultivation", ta: "விவசாயம்" },
  "inventory": { en: "Inventory", ta: "சரக்கு" },
  "equipment": { en: "Equipment", ta: "உபகரணங்கள்" },
  "livestock": { en: "Livestock", ta: "கால்நடைகள்" },
  "finance": { en: "Finance", ta: "நிதி" },
  "logout": { en: "Logout", ta: "வெளியேறு" },
  
  // Dashboard
  "total_plots": { en: "Total Plots", ta: "மொத்த நிலங்கள்" },
  "total_animals": { en: "Total Animals", ta: "மொத்த கால்நடைகள்" },
  "inventory_alerts": { en: "Inventory Alerts", ta: "சரக்கு எச்சரிக்கைகள்" },
  "employees": { en: "Employees", ta: "ஊழியர்கள்" },
  "monthly_revenue": { en: "Monthly Revenue", ta: "மாதாந்திர வருவாய்" },
  "monthly_expense": { en: "Monthly Expense", ta: "மாதாந்திர செலவு" },
  
  // Actions
  "add": { en: "Add", ta: "சேர்" },
  "edit": { en: "Edit", ta: "திருத்து" },
  "delete": { en: "Delete", ta: "நீக்கு" },
  "save": { en: "Save", ta: "சேமி" },
  "cancel": { en: "Cancel", ta: "ரத்து" },
  "submit": { en: "Submit", ta: "சமர்ப்பி" },
  "search": { en: "Search", ta: "தேடு" },
  "filter": { en: "Filter", ta: "வடிகட்டு" },
  "export": { en: "Export", ta: "ஏற்றுமதி" },
  "import": { en: "Import", ta: "இறக்குமதி" },
  
  // Forms
  "name": { en: "Name", ta: "பெயர்" },
  "date": { en: "Date", ta: "தேதி" },
  "description": { en: "Description", ta: "விளக்கம்" },
  "amount": { en: "Amount", ta: "தொகை" },
  "quantity": { en: "Quantity", ta: "அளவு" },
  "status": { en: "Status", ta: "நிலை" },
  "category": { en: "Category", ta: "வகை" },
  "notes": { en: "Notes", ta: "குறிப்புகள்" },
  
  // Authentication
  "login": { en: "Login", ta: "உள்நுழைவு" },
  "username": { en: "Username", ta: "பயனர்பெயர்" },
  "password": { en: "Password", ta: "கடவுச்சொல்" },
  "role": { en: "Role", ta: "பங்கு" },
  
  // Roles
  "admin": { en: "Admin", ta: "நிர்வாகி" },
  "manager": { en: "Manager", ta: "மேலாளர்" },
  "supervisor": { en: "Supervisor", ta: "மேற்பார்வையாளர்" },
  "operator": { en: "Operator", ta: "இயக்குபவர்" },
  "viewer": { en: "Viewer", ta: "பார்வையாளர்" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("farm-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("farm-language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ta" : "en");
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
