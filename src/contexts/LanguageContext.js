import { createContext, useContext, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

// Language state structure
const initialState = {
  currentLanguage: "vi",
  supportedLanguages: [
    { code: "vi", name: "Tiếng Việt", nativeName: "Tiếng Việt" },
    { code: "en", name: "English", nativeName: "English" },
  ],
  isRTL: false,
  loading: false,
  error: null,
};

// Language actions
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: "SET_LANGUAGE",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Language reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload,
        isRTL: ["ar", "he", "fa"].includes(action.payload),
        loading: false,
        error: null,
      };

    case LANGUAGE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case LANGUAGE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case LANGUAGE_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Create context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);
  const { i18n, t } = useTranslation();

  // Initialize language on app start
  useEffect(() => {
    const savedLanguage = localStorage.getItem("mia_logistics_language");
    const browserLanguage = navigator.language.split("-")[0];

    const languageToUse =
      savedLanguage ||
      state.supportedLanguages.find((lang) => lang.code === browserLanguage)
        ?.code ||
      "vi";

    if (languageToUse !== state.currentLanguage) {
      changeLanguage(languageToUse);
    }
  }, []);

  // Change language function
  const changeLanguage = async (languageCode) => {
    try {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: true });

      // Check if language is supported
      const isSupported = state.supportedLanguages.some(
        (lang) => lang.code === languageCode,
      );
      if (!isSupported) {
        throw new Error(`Language '${languageCode}' is not supported`);
      }

      // Change i18n language
      await i18n.changeLanguage(languageCode);

      // Update state
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: languageCode });

      // Save to localStorage
      localStorage.setItem("mia_logistics_language", languageCode);

      // Update document attributes
      document.documentElement.lang = languageCode;
      document.documentElement.dir = ["ar", "he", "fa"].includes(languageCode)
        ? "rtl"
        : "ltr";
    } catch (error) {
      console.error("Failed to change language:", error);
      dispatch({ type: LANGUAGE_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return (
      state.supportedLanguages.find(
        (lang) => lang.code === state.currentLanguage,
      ) || state.supportedLanguages[0]
    );
  };

  // Format message with parameters
  const formatMessage = (key, params = {}) => {
    try {
      return t(key, params);
    } catch (error) {
      console.warn(`Translation key '${key}' not found`);
      return key;
    }
  };

  // Get localized date format
  const getDateFormat = () => {
    switch (state.currentLanguage) {
      case "vi":
        return "dd/MM/yyyy";
      case "en":
        return "MM/dd/yyyy";
      default:
        return "dd/MM/yyyy";
    }
  };

  // Get localized time format
  const getTimeFormat = () => {
    switch (state.currentLanguage) {
      case "vi":
        return "HH:mm:ss";
      case "en":
        return "hh:mm:ss a";
      default:
        return "HH:mm:ss";
    }
  };

  // Get number format
  const getNumberFormat = () => {
    switch (state.currentLanguage) {
      case "vi":
        return { decimal: ",", thousands: "." };
      case "en":
        return { decimal: ".", thousands: "," };
      default:
        return { decimal: ",", thousands: "." };
    }
  };

  // Format number with locale
  const formatNumber = (number, options = {}) => {
    try {
      const locale = state.currentLanguage === "vi" ? "vi-VN" : "en-US";
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (error) {
      return number.toString();
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = "VND") => {
    try {
      const locale = state.currentLanguage === "vi" ? "vi-VN" : "en-US";
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch (error) {
      return `${amount} ${currency}`;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: LANGUAGE_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    ...state,
    currentLanguageInfo: getCurrentLanguageInfo(),

    // Actions
    changeLanguage,
    clearError,

    // Translation functions
    t: formatMessage,
    formatMessage,

    // Formatting utilities
    getDateFormat,
    getTimeFormat,
    getNumberFormat,
    formatNumber,
    formatCurrency,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Export context for advanced usage
export { LanguageContext };
export default LanguageContext;
