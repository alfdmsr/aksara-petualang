export type NeedKey = "hunger" | "energy" | "mood";
export type HeroState = {
  level: number;
  xp: number;
  lastSeenAt: number;
  needs: Record<
    NeedKey,
    { value: number; decayperHour: number; updatedAt: number }
  >;
  equipped: { outfitId: string | null };
};

export type Item = {
  id: string;
  type: "food" | "clothes";
  name: string;
  price: number;
  assetUrl: string;
  effects?: Record<string, number>;
};
