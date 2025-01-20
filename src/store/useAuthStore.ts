import { create } from "zustand";
import { User } from "@/src/type";
import { user } from "@/src/services/authService";

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  fetchUser: () => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found");
      }

      const userResponse = await user(token);
      set({ user: userResponse.user, isLoggedIn: true });
      return userResponse;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
    localStorage.removeItem("authToken");
  },
}));
