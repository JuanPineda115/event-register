import { create } from 'zustand';

interface RegistrationTypeState {
    registrationType: string;
    setRegistrationType: (type: string) => void;
}

export const useRegistrationTypeStore = create<RegistrationTypeState>((set) => ({
    registrationType: '',
    setRegistrationType: (type) => set({ registrationType: type }),
})); 