import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegistrationTypeState {
    registrationType: string;
    setRegistrationType: (type: string) => void;
}

export const useRegistrationTypeStore = create<RegistrationTypeState>()(
    persist(
        (set) => ({
            registrationType: '',
            setRegistrationType: (type) => set({ registrationType: type }),
        }),
        {
            name: 'registration-type-storage',
        }
    )
); 