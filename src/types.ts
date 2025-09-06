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
