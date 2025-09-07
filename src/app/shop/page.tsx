"use client";
import catalog from "@/data/catalog.json";
import ItemCard from "@/components/ItemCard";
import { useGameStore } from "@/state/useGameStore";
import { useEffect } from "react";
import { Item } from "@/types";

export default function ShopPage() {
  const { fetchState, inventory, wallet } = useGameStore();
  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const items = catalog.items as Item[];

  async function buy(itemId: string) {
    const r = await fetch("/api/purchase", {
      method: "POST",
      body: JSON.stringify({ itemId }),
    });
    if (!r.ok) return alert("Gagal beli");
    await fetchState();
  }
  async function equip(itemId: string) {
    const r = await fetch("/api/equip", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    const d = await r.json();
    if (!r.ok) return alert(d?.error.code || "Gagal equip");
    await fetchState();
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-2">
      <h1 className="text-xl font-bold">Shop</h1>
      <div className="text-sm">Coins: {wallet?.coins ?? "-"}</div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((it) => {
          const inv = inventory.find((x) => x.item_id === it.id);
          const owned = !!inv;
          const isClothes = it.type === "clothes";

          return (
            <ItemCard
              key={it.id}
              name={it.name}
              price={it.price}
              img={it.assetUrl}
              owned={owned}
              equipped={isClothes ? inv?.equipped : false}
              onBuy={() => buy(it.id)}
              onEquip={() =>
                isClothes ? equip(it.id) : alert("Item ini bukan pakaian.")
              }
            />
          );
        })}
      </div>
    </div>
  );
}
