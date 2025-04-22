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
    emergencyContact: string;
    emergencyPhone: string;
    category: string;
    size: string;
    gender: string;
}

// Define the form errors interface
export interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    category?: string;
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
    emergencyContact: '',
    emergencyPhone: '',
    category: '',
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

const validatePhone = (phone: string): string | undefined => {
    if (!phone) return 'El teléfono es requerido';
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phone)) return 'El teléfono debe tener 8 dígitos sin espacios';
    return undefined;
};

const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value) return `${fieldName} es requerido`;
    return undefined;
};

const validateCategory = (category: string): string | undefined => {
    if (!category) return 'La categoría es requerida';
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

            validateField: (field: keyof PersonalInfo, value: string) =>
                set((state) => {
                    let error: string | undefined;

                    switch (field) {
                        case 'email':
                            error = validateEmail(value);
                            break;
                        case 'phone':
                        case 'emergencyPhone':
                            error = validatePhone(value);
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
                        case 'category':
                            error = validateCategory(value);
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
                        case 'email':
                            error = validateEmail(value);
                            break;
                        case 'phone':
                        case 'emergencyPhone':
                            error = validatePhone(value);
                            break;
                        default:
                            error = validateRequired(value, field);
                    }

                    if (error) {
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