import en from "../localization/en.ts";
import sv from "../localization/sv.ts";
import { useLang } from "./useLang.tsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translationsMap: Record<string, any> = {
  en,
  sv,
  // Add other languages here
};

const getTranslateFunction = (lang: string) => {
  const translations = translationsMap[lang] || en;
  return (root: string, key: string): string => {
    const combinedKey = `${root}.${key}`;
    const pageTranslations = translations[root];
    if (!pageTranslations) {
      return "Missing translations for key: " + combinedKey;
    }

    const translation = pageTranslations[key];
    if (translation === undefined) {
      return "Missing translations for key: " + combinedKey;
    }

    return translation as string;
  };
};

export const useTranslate = () => {
  const lang = useLang();
  return { translate: getTranslateFunction(lang) };
};

export const getTranslator = (lang: string) => {
  return { translate: getTranslateFunction(lang) };
};
