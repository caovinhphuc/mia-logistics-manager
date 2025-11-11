/**
 * Example Unit Tests
 *
 * Các test cases mẫu cho utility functions
 */

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    // Mock implementation
    const formatCurrency = (amount) => {
      if (amount === 0) return '0 ₫';
      if (amount < 0) return `-${Math.abs(amount).toLocaleString('vi-VN')} ₫`;
      return `${amount.toLocaleString('vi-VN')} ₫`;
    };

    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000000)).toBe('1.000.000 ₫');
      expect(formatCurrency(5000)).toBe('5.000 ₫');
    });

    it('should handle zero value', () => {
      expect(formatCurrency(0)).toBe('0 ₫');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-5000)).toBe('-5.000 ₫');
    });
  });

  describe('validateEmail', () => {
    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    it('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('calculateVolume', () => {
    const calculateVolume = (length, width, height) => {
      if (!length || !width || !height) return 0;
      if (length < 0 || width < 0 || height < 0) return 0;
      return (length * width * height) / 1000000; // Convert to m³
    };

    it('should calculate volume correctly', () => {
      expect(calculateVolume(100, 50, 30)).toBe(0.15);
      expect(calculateVolume(200, 100, 50)).toBe(1);
    });

    it('should return 0 for invalid inputs', () => {
      expect(calculateVolume(0, 50, 30)).toBe(0);
      expect(calculateVolume(-100, 50, 30)).toBe(0);
      expect(calculateVolume(null, 50, 30)).toBe(0);
    });
  });
});

describe('Date Utilities', () => {
  describe('formatDate', () => {
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN');
    };

    it('should format date correctly', () => {
      const date = new Date('2025-11-12');
      expect(formatDate(date)).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle empty input', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('')).toBe('');
    });
  });
});

describe('String Utilities', () => {
  describe('truncateText', () => {
    const truncateText = (text, maxLength) => {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('should handle empty input', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText(null, 10)).toBe('');
    });
  });
});
