import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the step interface
export interface Step {
    label: string;
    completed: boolean;
    current: boolean;
}

// Define the personal info interface
export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneCountry: string;
    emergencyContact: string;
    emergencyPhone: string;
    emergencyPhoneCountry: string;
    size: string;
    gender: string;
}

// Define the form errors interface
export interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    phoneCountry?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    emergencyPhoneCountry?: string;
    size?: string;
    gender?: string;
}

// Define the registration store state
interface RegistrationState {
    // Progress bar state
    steps: Step[];
    currentStepIndex: number;

    // Personal info state
    personalInfo: PersonalInfo;
    formErrors: FormErrors;

    // Actions
    setCurrentStep: (index: number) => void;
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    validateField: (field: keyof PersonalInfo, value: string) => void;
    validateForm: () => boolean;
    resetRegistration: () => void;
}

// Initial steps
const initialSteps: Step[] = [
    { label: 'Inicio', completed: true, current: false },
    { label: 'Detalles y reglamento', completed: false, current: false },
    { label: 'Información Personal', completed: false, current: false },
    { label: 'Pago', completed: false, current: false },
];

// Initial personal info
const initialPersonalInfo: PersonalInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountry: 'GT',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyPhoneCountry: 'GT',
    size: '',
    gender: '',
};

// Initial form errors
const initialFormErrors: FormErrors = {};

// Validation functions
const validateEmail = (email: string): string | undefined => {
    if (!email) return 'El correo electrónico es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'El correo electrónico no es válido';
    return undefined;
};

// Phone number validation by country
const phoneValidationRules: { [key: string]: { pattern: RegExp, length: number } } = {
    'CR': { pattern: /^\d+$/, length: 8 },
    'GT': { pattern: /^\d+$/, length: 8 },
};

const validatePhone = (phone: string, country: string): string | undefined => {
    if (!country) return 'Debe seleccionar un país';
    if (!phone) return 'El teléfono es requerido';

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

const validateSize = (size: string): string | undefined => {
    if (!size) return 'La talla es requerida';
};

// Create the store
export const useRegistrationStore = create<RegistrationState>()(
    persist(
        (set, get) => ({
            // Initial state
            steps: initialSteps,
            currentStepIndex: 0,
            personalInfo: initialPersonalInfo,
            formErrors: initialFormErrors,

            // Actions
            setCurrentStep: (index: number) =>
                set((state) => {
                    // Create a new steps array with updated completed and current states
                    const newSteps = state.steps.map((step, i) => ({
                        ...step,
                        completed: i < index,
                        current: i === index,
                    }));

                    return {
                        steps: newSteps,
                        currentStepIndex: index,
                    };
                }),

            updatePersonalInfo: (info: Partial<PersonalInfo>) =>
                set((state) => ({
                    personalInfo: { ...state.personalInfo, ...info },
                })),

            validateField: (field: string, value: string) =>
                set((state) => {
                    let error: string | undefined;

                    switch (field) {
                        case 'email':
                            error = validateEmail(value);
                            break;
                        case 'phone':
                            error = validatePhone(value, state.personalInfo.phoneCountry);
                            break;
                        case 'emergencyPhone':
                            error = validatePhone(value, state.personalInfo.emergencyPhoneCountry);
                            break;
                        case 'phoneCountry':
                        case 'emergencyPhoneCountry':
                            error = validateRequired(value, 'País');
                            break;
                        case 'firstName':
                            error = validateRequired(value, 'Nombre');
                            break;
                        case 'lastName':
                            error = validateRequired(value, 'Apellido');
                            break;
                        case 'emergencyContact':
                            error = validateRequired(value, 'Contacto de emergencia');
                            break;
                        case 'size':
                            error = validateSize(value);
                            break;
                        case 'gender':
                            error = validateRequired(value, 'Sexo');
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
                const { personalInfo } = state;
                let isValid = true;
                const newErrors: FormErrors = {};

                // Validate all fields
                Object.keys(personalInfo).forEach((field) => {
                    const value = personalInfo[field as keyof PersonalInfo];
                    let error: string | undefined;

                    switch (field) {
                        case 'firstName':
                            error = validateRequired(value, 'Nombre');
                            break;
                        case 'lastName':
                            error = validateRequired(value, 'Apellido');
                            break;
                        case 'emergencyContact':
                            error = validateRequired(value, 'Contacto de emergencia');
                            break;
                        case 'size':
                            error = validateSize(value);
                            break;
                        case 'gender':
                            error = validateRequired(value, 'Sexo');
                            break;
                        case 'email':
                            error = validateEmail(value);
                            break;
                        case 'phone':
                            error = validatePhone(value, personalInfo.phoneCountry);
                            break;
                        case 'emergencyPhone':
                            error = validatePhone(value, personalInfo.emergencyPhoneCountry);
                            break;
                        case 'phoneCountry':
                        case 'emergencyPhoneCountry':
                            error = validateRequired(value, 'País');
                            break;
                        default:
                            error = validateRequired(value, field);
                    }

                    if (error) {
                        console.log(`Error in ${field}: ${error}`); // Log the error
                        isValid = false;
                        newErrors[field as keyof FormErrors] = error;
                    }
                });

                // Update form errors
                set({ formErrors: newErrors });

                return isValid;
            },

            resetRegistration: () =>
                set({
                    steps: initialSteps,
                    currentStepIndex: 0,
                    personalInfo: initialPersonalInfo,
                    formErrors: initialFormErrors,
                }),
        }),
        {
            name: 'registration-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                personalInfo: state.personalInfo,
                currentStepIndex: state.currentStepIndex,
                steps: state.steps,
            }),
        }
    )
); 