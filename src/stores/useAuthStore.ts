import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MemberInfo {
  idx: number;
  member_id: string;
  email: string;
  Name_1st: string; // First Name
  Name_3rd: string; // Last Name
  member_pwd: string; // pwd
  Birth_year?: string;
  Birth_month?: string;
  Birth_day?: string;
  Gender?: string;
  Nationality?: string;
  City?: string;
  Phone?: string;
  National_Code?: string;
  MailYN?: string;
  isPush?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  member: MemberInfo | null;
  autoLogin: boolean;
  login: (token: string, member: MemberInfo, autoLogin: boolean) => void;
  logout: () => void;
  updateMailYN: (MailYN: string) => void; 
  updateIsPush: (isPush: string) => void; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      member: null,
      autoLogin: false,
      login: (token, member, autoLogin) =>
        set(() => ({
          isLoggedIn: true,
          token,
          member,
          autoLogin,
        })),
      logout: () =>
        set(() => ({
          isLoggedIn: false,
          token: null,
          member: null,
          autoLogin: false,
        })),
      updateMailYN: (MailYN: string) =>
        set((state) => ({
          member: state.member ? { ...state.member, MailYN } : null,
        })),
        updateIsPush: (isPush) =>
        set((state) => ({
          member: state.member ? { ...state.member, isPush } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
