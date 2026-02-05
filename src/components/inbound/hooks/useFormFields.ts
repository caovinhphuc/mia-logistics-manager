import { useState, useCallback } from 'react';
import { FormFields } from '../types/inbound';

export const useFormFields = (initialFields?: Partial<FormFields>) => {
  const [formFields, setFormFields] = useState<FormFields>({
    id: '',
    date: '',
    supplier: '',
    origin: '',
    destination: '',
    product: '',
    quantity: 0,
    status: 'pending',
    estimatedArrival: '',
    actualArrival: '',
    carrier: '',
    pi: '',
    container: 0,
    category: '',
    purpose: 'online',
    receiveTime: '',
    notes: '',
    poNumbers: '',
    poNumbersInput: '',
    ...initialFields,
  });

  const setField = useCallback((field: keyof FormFields, value: unknown) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormFields({
      id: '',
      date: '',
      supplier: '',
      origin: '',
      destination: '',
      product: '',
      quantity: 0,
      status: 'pending',
      estimatedArrival: '',
      actualArrival: '',
      carrier: '',
      pi: '',
      container: 0,
      category: '',
      purpose: 'online',
      receiveTime: '',
      notes: '',
      poNumbers: '',
      poNumbersInput: '',
    });
  }, []);

  const setFormData = useCallback((data: Partial<FormFields>) => {
    setFormFields((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  return {
    formFields,
    setField,
    resetForm,
    setFormData,
  };
};
