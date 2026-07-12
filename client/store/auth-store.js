"use client";

import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isReady: false,
  hydrate: () => {
    const token = window.localStorage.getItem("token");
    const rawUser = window.localStorage.getItem("user");
    set({ token, user: rawUser ? JSON.parse(rawUser) : null, isReady: true });
  },
  setSession: ({ user, token }) => {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isReady: true });
  },
  logout: () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    set({ user: null, token: null, isReady: true });
  }
}));
