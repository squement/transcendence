import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'fr', label: '🇫🇷' },
  { code: 'en', label: '🇬🇧' },
  { code: 'de', label: '🇩🇪' },
  { code: 'ar', label: '🇸🇦' },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // sync dir + lang attribute on <html> whenever language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="lang-switcher" dir="ltr">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          disabled={i18n.language === code}
          className={`lang-btn${i18n.language === code ? ' lang-btn--active' : ''}`}
          aria-label={`Switch language to ${code}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
