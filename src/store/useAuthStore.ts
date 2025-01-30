import { create } from "zustand";
import { User } from "@/src/type";
import { fetchUser } from "@/src/services/userService";

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  fetchUser: () => Promise<User>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found");
      }

      const userResponse = await fetchUser(token);
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
