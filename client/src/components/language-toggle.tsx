import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title="Toggle Language"
      data-testid="button-language-toggle"
    >
      <Languages className="h-5 w-5" />
      <span className="ml-2 text-xs font-medium">{language.toUpperCase()}</span>
    </Button>
  );
}
