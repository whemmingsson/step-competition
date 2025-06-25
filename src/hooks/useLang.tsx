// useLang.ts
import { useParams } from "react-router-dom";

export function useLang() {
  const { lang } = useParams();
  return lang || "en";
}
