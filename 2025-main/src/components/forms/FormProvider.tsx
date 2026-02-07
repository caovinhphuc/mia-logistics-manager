import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface FormErrors {
  [key: string]: string;
}

interface FormValues {
  [key: string]: any;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, values: FormValues) => string | undefined;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

interface FormContextValue {
  values: FormValues;
  errors: FormErrors;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
  clearAllErrors: () => void;
  validateField: (name: string, value: any) => boolean;
  validateForm: () => boolean;
  isValid: boolean;
  isDirty: boolean;
  reset: (newValues?: FormValues) => void;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
  initialValues?: FormValues;
  validationSchema?: ValidationSchema;
  onSubmit?: (values: FormValues) => void | Promise<void>;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialValues = {},
  validationSchema = {},
  onSubmit,
}) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateField = useCallback((name: string, value: any): boolean => {
    const rule = validationSchema[name];
    if (!rule) return true;

    let errorMessage = '';

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errorMessage = `${name} is required`;
    }

    // MinLength validation
    if (!errorMessage && rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      errorMessage = `${name} must be at least ${rule.minLength} characters`;
    }

    // MaxLength validation
    if (!errorMessage && rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      errorMessage = `${name} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (!errorMessage && rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errorMessage = `${name} format is invalid`;
    }

    // Custom validation
    if (!errorMessage && rule.custom) {
      const customError = rule.custom(value, values);
      if (customError) {
        errorMessage = customError;
      }
    }

    if (errorMessage) {
      setError(name, errorMessage);
      return false;
    } else {
      clearError(name);
      return true;
    }
  }, [validationSchema, values, setError, clearError]);

  const validateForm = useCallback((): boolean => {
    let isFormValid = true;
    const newErrors: FormErrors = {};

    Object.keys(validationSchema).forEach(fieldName => {
      const fieldValue = values[fieldName];
      const isFieldValid = validateField(fieldName, fieldValue);

      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }, [validationSchema, values, validateField]);

  const reset = useCallback((newValues?: FormValues) => {
    setValues(newValues || initialValues);
    setErrors({});
    setIsDirty(false);
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  const contextValue: FormContextValue = {
    values,
    errors,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    validateField,
    validateForm,
    isValid,
    isDirty,
    reset,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

// Form wrapper component
interface FormProps {
  onSubmit: (values: FormValues) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

export const Form: React.FC<FormProps> = ({ onSubmit, children, className = '' }) => {
  const { values, validateForm } = useForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      await onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};
