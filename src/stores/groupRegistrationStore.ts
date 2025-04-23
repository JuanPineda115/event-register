import { create } from 'zustand';

interface GroupRegistrationState {
  teamName: string;
  teamMembers: Array<{
    name: string;
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone: string;
  }>;
  setTeamName: (name: string) => void;
  addTeamMember: (member: {
    name: string;
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone: string;
  }) => void;
  removeTeamMember: (index: number) => void;
  clearGroupRegistration: () => void;
}

export const useGroupRegistrationStore = create<GroupRegistrationState>((set) => ({
  teamName: '',
  teamMembers: [],
  setTeamName: (name) => set({ teamName: name }),
  addTeamMember: (member) => set((state) => ({
    teamMembers: [...state.teamMembers, member],
  })),
  removeTeamMember: (index) => set((state) => ({
    teamMembers: state.teamMembers.filter((_, i) => i !== index),
  })),
  clearGroupRegistration: () => set({ teamName: '', teamMembers: [] }),
})); 