"use client";
import { useEffect } from "react";
import { useGameStore } from "@/state/useGameStore";

export default function Home() {
  const { wallet, heroes, inventory, fetchState, loading } = useGameStore();
  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold"> Aksara Petualang</h1>
      <div>Coins: {wallet?.coins ?? "-"}</div>
      <div className="text-sm text-muted-foreground">
        {loading ? "Loading..." : "Loaded"}
      </div>
      <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
        {JSON.stringify({ heroes, inventory }, null, 2)}
      </pre>
    </main>
  );
}
