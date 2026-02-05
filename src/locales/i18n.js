import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import viTranslations from './vi.json';
import enTranslations from './en.json';

const resources = {
  vi: {
    translation: viTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Mặc định là Tiếng Việt
    fallbackLng: 'vi',
    debug: process.env.NODE_ENV === 'development',

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mia-language',
      // Chỉ detect nếu có saved language, nếu không thì dùng "vi"
      checkWhitelist: true,
    },

    interpolation: {
      escapeValue: false, // React đã tự động escape
    },

    react: {
      useSuspense: false,
    },
  });

// Đảm bảo ngôn ngữ mặc định là Tiếng Việt nếu không có trong localStorage
if (!localStorage.getItem('mia-language')) {
  i18n.changeLanguage('vi');
  localStorage.setItem('mia-language', 'vi');
}

export default i18n;
