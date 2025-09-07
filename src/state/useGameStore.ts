"use client";
import { create } from "zustand";

type Wallet = { user_id: string; coins: number };
type Hero = unknown; // nanti ganti dengan tipe yang sesuai dari Hero
type Inv = { user_id: string; item_id: string; qty: number; equipped: boolean };

type GameState = {
  loading: boolean;
  wallet?: Wallet;
  heroes?: Hero;
  inventory: Inv[];
  fetchState: () => Promise<void>;
};

export const useGameStore = create<GameState>((set) => ({
  loading: false,
  inventory: [],
  fetchState: async () => {
    set({ loading: true });
    const res = await fetch("/api/state");
    if (!res.ok) {
      set({ loading: false });
      return;
    }
    const data = await res.json();
    set({
      wallet: data.wallet,
      heroes: data.heroes,
      inventory: data.inventory,
      loading: false,
    });
  },
}));
