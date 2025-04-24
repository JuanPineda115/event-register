import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useRegistrationStore } from './registrationStore';
import { useGroupRegistrationStore } from './groupRegistrationStore';

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardType: string;
}

export interface PaymentErrors {
  cardNumber?: string;
  cardHolder?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
}

interface PaymentState {
  paymentInfo: PaymentInfo;
  errors: PaymentErrors;
  updatePaymentInfo: (info: Partial<PaymentInfo>) => void;
  validateField: (field: keyof PaymentInfo, value: string) => void;
  validateForm: () => boolean;
  resetPayment: () => void;
}

const initialPaymentInfo: PaymentInfo = {
  cardNumber: '',
  cardHolder: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  cardType: 'visa',
};

const initialErrors: PaymentErrors = {};

// OWASP validation patterns
const validationPatterns = {
  cardNumber: /^[0-9]{13,19}$/,
  cardHolder: /^[a-zA-Z\s]{2,}$/,
  expiryMonth: /^(0[1-9]|1[0-2])$/,
  expiryYear: /^[0-9]{4}$/,
  cvv: /^[0-9]{3,4}$/,
};

// Card type detection patterns
const cardPatterns = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^(5[1-5]|2[2-7])[0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/,
};

const detectCardType = (cardNumber: string): PaymentInfo['cardType'] => {
  const cleanedNumber = cardNumber.replace(/\s/g, '');
  if (cardPatterns.visa.test(cleanedNumber)) return 'visa';
  if (cardPatterns.mastercard.test(cleanedNumber)) return 'mastercard';
  if (cardPatterns.amex.test(cleanedNumber)) return 'amex';
  return 'visa';
};

const validateCardNumber = (value: string): string | undefined => {
  if (!value) return 'El número de tarjeta es requerido';
  const cleanedValue = value.replace(/\s/g, '');
  if (!validationPatterns.cardNumber.test(cleanedValue)) {
    return 'El número de tarjeta no es válido';
  }
  return undefined;
};

const validateCardHolder = (value: string): string | undefined => {
  if (!value) return 'El nombre del titular es requerido';
  if (!validationPatterns.cardHolder.test(value)) {
    return 'El nombre del titular no es válido';
  }
  return undefined;
};

const validateExpiryMonth = (value: string): string | undefined => {
  if (!value) return 'El mes de expiración es requerido';
  if (!validationPatterns.expiryMonth.test(value)) {
    return 'El mes de expiración no es válido';
  }
  return undefined;
};

const validateExpiryYear = (value: string): string | undefined => {
  if (!value) return 'El año de expiración es requerido';
  if (!validationPatterns.expiryYear.test(value)) {
    return 'El año de expiración no es válido';
  }
  const currentYear = new Date().getFullYear();
  const year = parseInt(value);
  if (year < currentYear) {
    return 'El año de expiración no puede ser anterior al año actual';
  }
  return undefined;
};

const validateCVV = (value: string, cardType: PaymentInfo['cardType']): string | undefined => {
  if (!value) return 'El CVV es requerido';
  const expectedLength = cardType === 'amex' ? 4 : 3;
  if (value.length !== expectedLength) {
    return `El CVV debe tener ${expectedLength} dígitos`;
  }
  if (!validationPatterns.cvv.test(value)) {
    return 'El CVV no es válido';
  }
  return undefined;
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      paymentInfo: initialPaymentInfo,
      errors: initialErrors,

      updatePaymentInfo: (info: Partial<PaymentInfo>) =>
        set((state) => {
          const newInfo = { ...state.paymentInfo, ...info };
          // Auto-detect card type when card number changes
          if (info.cardNumber !== undefined) {
            newInfo.cardType = detectCardType(info.cardNumber);
          }
          return { paymentInfo: newInfo };
        }),

      validateField: (field: keyof PaymentInfo, value: string) =>
        set((state) => {
          let error: string | undefined;

          switch (field) {
            case 'cardNumber':
              error = validateCardNumber(value);
              break;
            case 'cardHolder':
              error = validateCardHolder(value);
              break;
            case 'expiryMonth':
              error = validateExpiryMonth(value);
              break;
            case 'expiryYear':
              error = validateExpiryYear(value);
              break;
            case 'cvv':
              error = validateCVV(value, state.paymentInfo.cardType);
              break;
          }

          return {
            errors: {
              ...state.errors,
              [field]: error,
            },
          };
        }),

      validateForm: () => {
        const state = get();
        const { paymentInfo } = state;
        let isValid = true;
        const newErrors: PaymentErrors = {};

        // Validate all fields
        Object.entries(paymentInfo).forEach(([field, value]) => {
          if (field === 'cardType') return; // Skip cardType validation

          let error: string | undefined;
          switch (field) {
            case 'cardNumber':
              error = validateCardNumber(value);
              break;
            case 'cardHolder':
              error = validateCardHolder(value);
              break;
            case 'expiryMonth':
              error = validateExpiryMonth(value);
              break;
            case 'expiryYear':
              error = validateExpiryYear(value);
              break;
            case 'cvv':
              error = validateCVV(value, paymentInfo.cardType);
              break;
          }

          if (error) {
            isValid = false;
            newErrors[field as keyof PaymentErrors] = error;
          }
        });

        set({ errors: newErrors });
        return isValid;
      },

      resetPayment: () => set({ paymentInfo: initialPaymentInfo, errors: initialErrors }),
    }),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
); 