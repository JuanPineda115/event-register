import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the spectator info interface
export interface SpectatorInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneCountry: string;
    quantity: number;
}

// Define the form errors interface
export interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    phoneCountry?: string;
    quantity?: string;
}

// Define the store state
interface SpectatorState {
    spectatorInfo: SpectatorInfo;
    formErrors: FormErrors;
    updateSpectatorInfo: (info: Partial<SpectatorInfo>) => void;
    validateField: (field: keyof SpectatorInfo, value: string | number) => void;
    validateForm: () => boolean;
    resetSpectator: () => void;
    formatDataForApi: (eventId: number, paymentInfo: any) => any;
}

// Initial spectator info
const initialSpectatorInfo: SpectatorInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountry: 'GT',
    quantity: 1,
};

// Validation functions
const validateEmail = (email: string): string | undefined => {
    if (!email) return 'El correo electrónico es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'El correo electrónico no es válido';
    return undefined;
};

const validatePhone = (phone: string, country: string): string | undefined => {
    if (!country) return 'Debe seleccionar un país';
    if (!phone) return 'El teléfono es requerido';

    const phoneValidationRules: { [key: string]: { pattern: RegExp, length: number } } = {
        'CR': { pattern: /^\d+$/, length: 8 },
        'GT': { pattern: /^\d+$/, length: 8 },
        'US': { pattern: /^\d+$/, length: 10 },
        'MX': { pattern: /^\d+$/, length: 10 },
    };

    const rules = phoneValidationRules[country];
    if (!rules) return 'País no soportado';

    if (!rules.pattern.test(phone)) return 'El teléfono solo debe contener dígitos';
    if (phone.length !== rules.length) return `El teléfono debe tener ${rules.length} dígitos para ${country}`;

    return undefined;
};

const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value) return `${fieldName} es requerido`;
    return undefined;
};

const validateQuantity = (value: number): string | undefined => {
    if (!value) return 'La cantidad es requerida';
    if (value < 1) return 'La cantidad debe ser al menos 1';
    if (value > 10) return 'La cantidad máxima es 10';
    return undefined;
};

// Create the store
export const useSpectatorStore = create<SpectatorState>()(
    persist(
        (set, get) => ({
            spectatorInfo: initialSpectatorInfo,
            formErrors: {},

            updateSpectatorInfo: (info) =>
                set((state) => ({
                    spectatorInfo: { ...state.spectatorInfo, ...info },
                })),

            validateField: (field, value) =>
                set((state) => {
                    let error: string | undefined;

                    switch (field) {
                        case 'email':
                            error = validateEmail(value as string);
                            break;
                        case 'phone':
                            error = validatePhone(value as string, state.spectatorInfo.phoneCountry);
                            break;
                        case 'phoneCountry':
                            error = validateRequired(value as string, 'País');
                            break;
                        case 'firstName':
                            error = validateRequired(value as string, 'Nombre');
                            break;
                        case 'lastName':
                            error = validateRequired(value as string, 'Apellido');
                            break;
                        case 'quantity':
                            error = validateQuantity(value as number);
                            break;
                    }

                    return {
                        formErrors: {
                            ...state.formErrors,
                            [field]: error,
                        },
                    };
                }),

            validateForm: () => {
                const state = get();
                const { spectatorInfo } = state;
                let isValid = true;
                const newErrors: FormErrors = {};

                // Validate all fields
                Object.entries(spectatorInfo).forEach(([field, value]) => {
                    let error: string | undefined;

                    switch (field) {
                        case 'email':
                            error = validateEmail(value as string);
                            break;
                        case 'phone':
                            error = validatePhone(value as string, spectatorInfo.phoneCountry);
                            break;
                        case 'phoneCountry':
                            error = validateRequired(value as string, 'País');
                            break;
                        case 'firstName':
                            error = validateRequired(value as string, 'Nombre');
                            break;
                        case 'lastName':
                            error = validateRequired(value as string, 'Apellido');
                            break;
                        case 'quantity':
                            error = validateQuantity(value as number);
                            break;
                    }

                    if (error) {
                        isValid = false;
                        newErrors[field as keyof FormErrors] = error;
                    }
                });

                set({ formErrors: newErrors });
                return isValid;
            },

            resetSpectator: () =>
                set({
                    spectatorInfo: initialSpectatorInfo,
                    formErrors: {},
                }),

            formatDataForApi: (eventId: number, paymentInfo: any) => {
                const { spectatorInfo } = get();

                return {
                    is_athlete: false,
                    event_id: eventId,
                    quantity: spectatorInfo.quantity,
                    courtesy_code: '',

                    full_name: `${spectatorInfo.firstName} ${spectatorInfo.lastName}`,
                    email: spectatorInfo.email,
                    phone_number: spectatorInfo.phone,

                    client_first_name: spectatorInfo.firstName,
                    client_last_name: spectatorInfo.lastName,
                    client_phone: spectatorInfo.phone,
                    client_email: spectatorInfo.email,
                    client_country: spectatorInfo.phoneCountry,
                    client_city: 'Guatemala',
                    client_state: 'Guatemala',
                    client_postal_code: '01011',
                    client_location: 'Zona 1',

                    card_name: paymentInfo.cardHolder,
                    expiration_month: paymentInfo.expiryMonth,
                    expiration_year: paymentInfo.expiryYear.slice(-2),
                    card_number: paymentInfo.cardNumber,
                    cvv: paymentInfo.cvv,

                    simulate: true
                };
            },
        }),
        {
            name: 'spectator-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 