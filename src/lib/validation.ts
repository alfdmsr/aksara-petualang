import { z } from "zod";

export const purchaseBody = z.object({ itemId: z.string().min(1) });
export const claimBody = z.object({ missionId: z.string().min(1) });
export const equipBody = z.object({ itemId: z.string().min(1) });

export type PurchaseBody = z.infer<typeof purchaseBody>;
export type ClaimBody = z.infer<typeof claimBody>;
export type EquipBody = z.infer<typeof equipBody>;
