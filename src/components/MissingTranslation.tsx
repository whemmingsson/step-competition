import type { JSX } from "react";

export const MissingTranslation = ({
  langKey,
  lang,
}: {
  langKey: string;
  lang: string;
}): JSX.Element => {
  console.warn(`Missing translation for key: ${langKey}`);
  return (
    <span className="bg-amber-200">
      Translation not found for: <em>{langKey}</em> for <em>{lang}</em>
    </span>
  );
};
