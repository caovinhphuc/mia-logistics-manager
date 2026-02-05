import { createContext, useContext, useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';

// Language state structure
const initialState = {
  language: 'vi',
  availableLanguages: [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ],
  loading: false,
  rtl: false,
};

// Language actions
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LOADING: 'SET_LOADING',
  SET_RTL: 'SET_RTL',
};

// Language reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return { ...state, language: action.payload };

    case LANGUAGE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case LANGUAGE_ACTIONS.SET_RTL:
      return { ...state, rtl: action.payload };

    default:
      return state;
  }
};

// Create context
const LanguageContext = createContext();

// Language provider component
const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);
  const { i18n, t } = useTranslation();

  // Đảm bảo i18n luôn khởi tạo với Tiếng Việt ngay từ đầu
  useEffect(() => {
    if (!i18n.language || !state.availableLanguages.find((lang) => lang.code === i18n.language)) {
      i18n.changeLanguage('vi');
      localStorage.setItem('mia-language', 'vi');
      document.documentElement.lang = 'vi';
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: 'vi' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeLanguage = async (languageCode) => {
    try {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: true });

      await i18n.changeLanguage(languageCode);
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: languageCode });

      // Save to localStorage
      localStorage.setItem('mia-language', languageCode);

      // Update document language
      document.documentElement.lang = languageCode;

      // Check if RTL is needed (for future Arabic/Hebrew support)
      const rtlLanguages = ['ar', 'he', 'fa'];
      dispatch({
        type: LANGUAGE_ACTIONS.SET_RTL,
        payload: rtlLanguages.includes(languageCode),
      });

      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      // Language change error handled silently
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const getCurrentLanguageInfo = () => {
    return state.availableLanguages.find((lang) => lang.code === state.language);
  };

  const formatCurrency = (amount, currency = 'VND') => {
    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    };

    if (state.language === 'vi') {
      // Vietnamese formatting
      return new Intl.NumberFormat('vi-VN', options).format(amount);
    } else {
      // English formatting
      return new Intl.NumberFormat('en-US', options).format(amount);
    }
  };

  const formatNumber = (number) => {
    if (state.language === 'vi') {
      return new Intl.NumberFormat('vi-VN').format(number);
    } else {
      return new Intl.NumberFormat('en-US').format(number);
    }
  };

  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };

    if (state.language === 'vi') {
      return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(new Date(date));
    } else {
      return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
    }
  };

  const formatTime = (date, options = {}) => {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    };

    if (state.language === 'vi') {
      return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(new Date(date));
    } else {
      return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
    }
  };

  const formatDateTime = (date) => {
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  const contextValue = {
    ...state,
    changeLanguage,
    getCurrentLanguageInfo,
    formatCurrency,
    formatNumber,
    formatDate,
    formatTime,
    formatDateTime,
    t, // Translation function from react-i18next
  };

  // Initialize language from localStorage or browser
  useEffect(() => {
    const savedLanguage = localStorage.getItem('mia-language');

    // Luôn ưu tiên Tiếng Việt nếu không có savedLanguage hoặc savedLanguage không hợp lệ
    const availableCodes = state.availableLanguages.map((lang) => lang.code);
    const initialLanguage =
      savedLanguage && availableCodes.includes(savedLanguage) ? savedLanguage : 'vi';

    // Đảm bảo i18n và state đồng bộ với Tiếng Việt
    if (initialLanguage !== i18n.language) {
      i18n.changeLanguage(initialLanguage);
    }

    if (initialLanguage !== state.language) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: initialLanguage });
      localStorage.setItem('mia-language', initialLanguage);
      document.documentElement.lang = initialLanguage;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export default
export default LanguageContext;

// Named export for LanguageProvider
export { LanguageProvider };
