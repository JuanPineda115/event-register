import { create } from 'zustand';
import { useRegistrationStore } from './registrationStore';
import { useGroupRegistrationStore } from './groupRegistrationStore';

interface PaymentState {
  cardName: string;
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  courtesyCode: string;
  quantity: number;
  simulate: boolean;
  setCardName: (name: string) => void;
  setCardNumber: (number: string) => void;
  setExpirationMonth: (month: string) => void;
  setExpirationYear: (year: string) => void;
  setCvv: (cvv: string) => void;
  setCourtesyCode: (code: string) => void;
  setQuantity: (quantity: number) => void;
  setSimulate: (simulate: boolean) => void;
  submitPayment: (eventId: number) => Promise<Response>;
  clearPayment: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  cardName: '',
  cardNumber: '',
  expirationMonth: '',
  expirationYear: '',
  cvv: '',
  courtesyCode: '',
  quantity: 1,
  simulate: false,

  setCardName: (name) => set({ cardName: name }),
  setCardNumber: (number) => set({ cardNumber: number }),
  setExpirationMonth: (month) => set({ expirationMonth: month }),
  setExpirationYear: (year) => set({ expirationYear: year }),
  setCvv: (cvv) => set({ cvv: cvv }),
  setCourtesyCode: (code) => set({ courtesyCode: code }),
  setQuantity: (quantity) => set({ quantity: quantity }),
  setSimulate: (simulate) => set({ simulate: simulate }),

  clearPayment: () => set({
    cardName: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    courtesyCode: '',
    quantity: 1,
    simulate: false,
  }),

  submitPayment: async (eventId) => {
    const registrationStore = useRegistrationStore.getState();
    const groupStore = useGroupRegistrationStore.getState();
    const paymentStore = get();

    // Determine if this is a group registration
    const isGroupRegistration = groupStore.teamMembers.length > 0;

    // Prepare the form data
    const formData = {
      is_athlete: true, // Assuming all registrations are for athletes
      event_id: eventId,
      quantity: paymentStore.quantity,
      courtesy_code: paymentStore.courtesyCode,

      // Use group or individual registration data
      ...(isGroupRegistration
        ? {
            full_name: groupStore.teamName,
            email: groupStore.teamMembers[0]?.email || '',
            phone_number: groupStore.teamMembers[0]?.phone || '',
          }
        : {
            full_name: `${registrationStore.personalInfo.firstName} ${registrationStore.personalInfo.lastName}`,
            email: registrationStore.personalInfo.email,
            phone_number: registrationStore.personalInfo.phone,
          }),

      // Client information
      client_first_name: registrationStore.personalInfo.firstName,
      client_last_name: registrationStore.personalInfo.lastName,
      client_phone: registrationStore.personalInfo.phone,
      client_email: registrationStore.personalInfo.email,
      client_country: registrationStore.personalInfo.phoneCountry,
      client_city: 'Guatemala', // You might want to add this to the registration store
      client_state: 'Guatemala', // You might want to add this to the registration store
      client_postal_code: '01011', // You might want to add this to the registration store
      client_location: 'Zona 18', // You might want to add this to the registration store

      // Card information
      card_name: paymentStore.cardName,
      expiration_month: paymentStore.expirationMonth,
      expiration_year: paymentStore.expirationYear,
      card_number: paymentStore.cardNumber,
      cvv: paymentStore.cvv,

      simulate: paymentStore.simulate,
    };

    // Make the API call
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return response;
  },
})); 