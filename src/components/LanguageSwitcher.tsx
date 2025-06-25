// src/components/LanguageSwitcher.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/useLang";
import { GB as UKFlag, SE as SwedenFlag } from "country-flag-icons/react/3x2";

// Language configuration
const languages = [
  {
    code: "en",
    name: "English",
    flag: <UKFlag className="h-4 w-6" />,
  },
  {
    code: "sv",
    name: "Svenska",
    flag: <SwedenFlag className="h-4 w-6" />,
  },
];

export function LanguageSwitcher() {
  const lang = useLang(); // Custom hook to get current language
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current language from URL
  const currentLang = lang;

  // Function to switch languages while keeping the same page
  const switchLanguage = (newLang: string) => {
    // If we're already on this language, do nothing
    if (newLang === currentLang) return;

    // Get the current path without the language prefix
    let pathWithoutLang = location.pathname;
    if (pathWithoutLang.startsWith("/en")) {
      pathWithoutLang = pathWithoutLang.substring(3);
    } else if (pathWithoutLang.startsWith("/sv")) {
      pathWithoutLang = pathWithoutLang.substring(3);
    }

    // If path is empty, make it / to avoid double slash
    if (pathWithoutLang === "") pathWithoutLang = "/";

    // Navigate to same path but with new language
    navigate(`/${newLang}${pathWithoutLang}${location.search}`);
  };

  // Find the currently selected language object
  const selectedLanguage = languages.find((lang) => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2"
        >
          <span className="flex items-center gap-1">
            {selectedLanguage?.flag} {selectedLanguage?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              currentLang === lang.code && "bg-accent"
            )}
          >
            <span className="mr-1 flex-shrink-0">{lang.flag}</span>
            <span>{lang.name}</span>
            {currentLang === lang.code && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
