import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TeamMember {
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

interface GroupRegistrationState {
  teamName: string;
  contactEmail: string;
  teamMembers: TeamMember[];
  formErrors: {
    teamName?: string;
    contactEmail?: string;
    teamMembers?: {
      [key: number]: {
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
      };
    };
  };
  setTeamName: (name: string) => void;
  setContactEmail: (email: string) => void;
  updateTeamMember: (index: number, member: Partial<TeamMember>) => void;
  validateField: (memberIndex: number, field: keyof TeamMember, value: string) => void;
  validateForm: () => boolean;
  resetGroupRegistration: () => void;
  formatDataForApi: (eventId: number, paymentInfo: any) => any;
}

const initialTeamMember: TeamMember = {
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

export const useGroupRegistrationStore = create<GroupRegistrationState>()(
  persist(
    (set, get) => ({
      teamName: '',
      contactEmail: '',
      teamMembers: [initialTeamMember, initialTeamMember],
      formErrors: {},

      setTeamName: (name) => set({ teamName: name }),

      setContactEmail: (email) => set({ contactEmail: email }),

      updateTeamMember: (index, member) =>
        set((state) => {
          const newTeamMembers = [...state.teamMembers];
          newTeamMembers[index] = { ...newTeamMembers[index], ...member };
          return { teamMembers: newTeamMembers };
        }),

      validateField: (memberIndex, field, value) =>
        set((state) => {
          let error: string | undefined;

          switch (field) {
            case 'email':
              error = validateEmail(value);
              break;
            case 'phone':
              error = validatePhone(value, state.teamMembers[memberIndex].phoneCountry);
              break;
            case 'emergencyPhone':
              error = validatePhone(value, state.teamMembers[memberIndex].emergencyPhoneCountry);
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
              teamMembers: {
                ...state.formErrors.teamMembers,
                [memberIndex]: {
                  ...state.formErrors.teamMembers?.[memberIndex],
                  [field]: error,
                },
              },
            },
          };
        }),

      validateForm: () => {
        const state = get();
        let isValid = true;
        const newErrors: GroupRegistrationState['formErrors'] = {};

        // Validate team name
        if (!state.teamName) {
          isValid = false;
          newErrors.teamName = 'El nombre del equipo es requerido';
        }

        // Validate contact email
        const emailError = validateEmail(state.contactEmail);
        if (emailError) {
          isValid = false;
          newErrors.contactEmail = emailError;
        }

        // Validate each team member
        state.teamMembers.forEach((member, index) => {
          const memberErrors: { [key: string]: string | undefined } = {};

          Object.entries(member).forEach(([field, value]) => {
            let error: string | undefined;

            switch (field) {
              case 'email':
                error = validateEmail(value);
                break;
              case 'phone':
                error = validatePhone(value, member.phoneCountry);
                break;
              case 'emergencyPhone':
                error = validatePhone(value, member.emergencyPhoneCountry);
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

            if (error) {
              isValid = false;
              memberErrors[field] = error;
            }
          });

          if (Object.keys(memberErrors).length > 0) {
            newErrors.teamMembers = {
              ...newErrors.teamMembers,
              [index]: memberErrors,
            };
          }
        });

        set({ formErrors: newErrors });
        return isValid;
      },

      formatDataForApi: (eventId: number, paymentInfo: any) => {
        const state = get();
        const firstMember = state.teamMembers[0];

        return {
          is_athlete: true,
          event_id: eventId,
          group_name: state.teamName,
          contact_email: state.contactEmail,

          athletes: state.teamMembers.map(member => ({
            full_name: `${member.firstName} ${member.lastName}`,
            email: member.email,
            phone_number: member.phone,
            gender: member.gender,
            tshirt_size: member.size
          })),

          client_first_name: firstMember.firstName,
          client_last_name: firstMember.lastName,
          client_phone: firstMember.phone,
          client_email: state.contactEmail,
          client_country: firstMember.phoneCountry,
          client_city: "Guatemala",
          client_state: "Guatemala",
          client_postal_code: "01010",
          client_location: "Zona 1",

          card_name: paymentInfo.cardHolder,
          expiration_month: paymentInfo.expiryMonth,
          expiration_year: paymentInfo.expiryYear.slice(-2),
          card_number: paymentInfo.cardNumber,
          cvv: paymentInfo.cvv,

          simulate: false
        };
      },

      resetGroupRegistration: () =>
        set({
          teamName: '',
          contactEmail: '',
          teamMembers: [initialTeamMember, initialTeamMember],
          formErrors: {},
        }),
    }),
    {
      name: 'group-registration-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

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

const validateSize = (value: string): string | undefined => {
  if (!value) return 'La talla es requerida';
  const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  if (!validSizes.includes(value)) return 'Talla no válida';
  return undefined;
}; 