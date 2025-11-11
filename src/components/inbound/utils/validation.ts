// Validation utility functions

export const validateRequired = (
  value: unknown,
  fieldName: string
): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} là bắt buộc`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return 'Email không hợp lệ';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (phone && !phoneRegex.test(phone)) {
    return 'Số điện thoại không hợp lệ';
  }
  return null;
};

export const validateNumber = (
  value: unknown,
  fieldName: string
): string | null => {
  if (value !== null && value !== undefined && value !== '') {
    const num = Number(value);
    if (isNaN(num)) {
      return `${fieldName} phải là số`;
    }
    if (num < 0) {
      return `${fieldName} phải lớn hơn hoặc bằng 0`;
    }
  }
  return null;
};

export const validatePositiveNumber = (
  value: unknown,
  fieldName: string
): string | null => {
  if (value !== null && value !== undefined && value !== '') {
    const num = Number(value);
    if (isNaN(num)) {
      return `${fieldName} phải là số`;
    }
    if (num <= 0) {
      return `${fieldName} phải lớn hơn 0`;
    }
  }
  return null;
};

export const validateDate = (
  date: unknown,
  fieldName: string
): string | null => {
  if (date && typeof date === 'string') {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return `${fieldName} không hợp lệ`;
    }
  }
  return null;
};

export const validateFutureDate = (
  date: string,
  fieldName: string
): string | null => {
  if (date) {
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(dateObj.getTime())) {
      return `${fieldName} không hợp lệ`;
    }

    if (dateObj < today) {
      return `${fieldName} phải là ngày trong tương lai`;
    }
  }
  return null;
};

export const validatePONumbers = (poNumbers: unknown): string | null => {
  if (poNumbers && typeof poNumbers === 'string') {
    const poArray = poNumbers.split(',').map((po) => po.trim());
    const invalidPOs = poArray.filter((po) => !po.match(/^PO-\d{4}-\d{3}$/));

    if (invalidPOs.length > 0) {
      return `Mã PO không hợp lệ: ${invalidPOs.join(', ')}. Định dạng: PO-YYYY-XXX`;
    }
  }
  return null;
};

export const validatePICode = (pi: unknown): string | null => {
  if (pi && typeof pi === 'string' && !pi.match(/^PI-(INT|DOM)-\d{4}-\d{3}$/)) {
    return 'Mã PI không hợp lệ. Định dạng: PI-INT-YYYY-XXX hoặc PI-DOM-YYYY-XXX';
  }
  return null;
};

// Form validation
export interface ValidationRule {
  field: string;
  validator: (value: unknown) => string | null;
}

export const validateForm = (
  data: Record<string, unknown>,
  rules: ValidationRule[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  rules.forEach((rule) => {
    const error = rule.validator(data[rule.field]);
    if (error) {
      errors[rule.field] = error;
    }
  });

  return errors;
};

// Inbound item validation rules
export const getInboundItemValidationRules = (): ValidationRule[] => [
  {
    field: 'supplier',
    validator: (value) => validateRequired(value, 'Nhà cung cấp'),
  },
  {
    field: 'product',
    validator: (value) => validateRequired(value, 'Sản phẩm'),
  },
  {
    field: 'quantity',
    validator: (value) => validatePositiveNumber(value, 'Số lượng'),
  },
  { field: 'pi', validator: (value) => validatePICode(value) },
  {
    field: 'container',
    validator: (value) => validatePositiveNumber(value, 'Container'),
  },
  {
    field: 'estimatedArrival',
    validator: (value) => validateDate(value, 'Ngày dự kiến đến'),
  },
  { field: 'poNumbers', validator: (value) => validatePONumbers(value) },
];
