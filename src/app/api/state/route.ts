import { supabaseServer } from "@/lib/supabaseServer";
import { nowEpochSec } from "@/lib/todayJakarta";

export async function GET() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return Response.json({ error: { code: "UNAUTH" } }, { status: 401 });

  const uid = user.id;
  // default dulu
  const { data: w0 } = await supabase
    .from("wallet")
    .select("user_id")
    .eq("user_id", uid)
    .maybeSingle();
  if (!w0) {
    await supabase.from("wallet").insert({ user_id: uid, coins: 100 });
  }
  const defaultHero = {
    level: 1,
    xp: 0,
    lastSeenAt: nowEpochSec(),
    needs: {
      hunger: { value: 70, decayPerHour: 8, updatedAt: nowEpochSec() },
      energy: { value: 60, decayPerHour: 5, updatedAt: nowEpochSec() },
      mood: { value: 65, decayPerHour: 4, updatedAt: nowEpochSec() },
    },
    equipped: { outfitId: null },
  };

  const { data: h0 } = await supabase
    .from("hero_state")
    .select("user_id")
    .eq("user_id", uid)
    .maybeSingle();
  if (!h0) {
    await supabase
      .from("hero_state")
      .insert({ user_id: uid, data: defaultHero });
  }
  // await supabase
  //   .from("hero_state")
  //   .upsert({ user_id: uid, data: defaultHero })
  //   .eq("user_id", uid);

  const [w, h, inv] = await Promise.all([
    supabase.from("wallet").select("*").eq("user_id", uid).single(),
    supabase.from("hero_state").select("*").eq("user_id", uid).single(),
    supabase.from("inventory").select("*").eq("user_id", uid),
  ]);

  return Response.json({
    wallet: w.data,
    hero: h.data?.data,
    inventory: inv.data ?? [],
  });
}
