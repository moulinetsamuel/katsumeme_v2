import { create } from "zustand";
import { User } from "@/src/type";
import { login } from "@/src/services/authService";

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,

  login: async (email, password) => {
    try {
      const { user, token } = await login({ email, password });
      set({ user, isLoggedIn: true });
      localStorage.setItem("authToken", token);
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
    localStorage.removeItem("authToken");
  },
}));
