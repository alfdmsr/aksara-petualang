import { supabaseServer } from "@/lib/supabaseServer";
import catalog from "@/data/catalog.json";
import { Item } from "@/types";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user)
    return Response.json({ error: { code: "UNAUTH" } }, { status: 401 });

  const { itemId } = await req.json();
  if (!itemId)
    return Response.json({ error: { code: "BAD_REQ" } }, { status: 400 });

  const items = catalog.items as Item[];
  const meta = items.find((i) => i.id === itemId);
  if (!meta)
    return Response.json(
      { error: { code: "ITEM_NOT_FOUND" } },
      { status: 404 }
    );
  if (meta.type !== "clothes") {
    return Response.json(
      { error: { code: "NOT_EQUIPPABLE" } },
      { status: 400 }
    );
  }

  const uid = user.id;

  // 1) Cek inventory, pastikan item ada dan dimiliki oleh user
  const { data: invRow, error: invErr } = await sb
    .from("inventory")
    .select("*")
    .eq("user_id", uid)
    .eq("item_id", itemId)
    .maybeSingle();
  if (!invErr)
    return Response.json(
      { error: { code: "INV_SELECT_FAIL" } },
      { status: 500 }
    );
  if (!invRow)
    return Response.json({ error: { code: "NOT_OWNED" } }, { status: 400 });

  // 2) Update hero
  const { data: heroRow } = await sb
    .from("heroes_state")
    .select("*")
    .eq("user_id", uid)
    .maybeSingle();

  const hero = heroRow?.data ?? {
    level: 1,
    xp: 0,
    lastSeenAt: Math.floor(Date.now() / 1000),
    needs: {},
    equipped: { outfitId: null },
  };
  hero.equipped = hero.equipped || {};
  hero.equipped.outfitId = itemId;

  const unset = await sb
    .from("inventory")
    .update({ equipped: false })
    .eq("user_id", uid)
    .in(
      "item_id",
      items.filter((i) => i.type === "clothes").map((i) => i.id)
    );

  if (unset.error)
    return Response.json(
      { error: { code: "INV_UNSET_EQUIPPED_FAIL" } },
      { status: 500 }
    );

  const set = await sb
    .from("inventory")
    .update({ equipped: true })
    .eq("user_id", uid)
    .eq("item_id", itemId);

  if (set.error)
    return Response.json(
      { error: { code: "INV_SET_EQUIPPED_FAIL" } },
      { status: 500 }
    );

  const upd = await sb
    .from("pet_state")
    .update({ data: hero })
    .eq("user_id", uid);

  if (upd.error)
    return Response.json(
      { error: { code: "PET_UPDATE_FAIL" } },
      { status: 500 }
    );
  // if (!heroRow)
  //   return Response.json(
  //     { error: { code: "HERO_NOT_FOUND" } },
  //     { status: 400 }
  //   );

  // const hero = heroRow.data || {};
  // hero.equipped = hero.equipped || {};
  // hero.equipped.outfitId = itemId;

  // const { error: e } = await sb
  //   .from("heroes_state")
  //   .update({ data: hero })
  //   .eq("user_id", uid);

  // if (e)
  //   return Response.json(
  //     { error: { code: "HERO_UPDATE_FALL" } },
  //     { status: 500 }
  //   );

  // kembalikan state terbaru
  const [h2, inv2] = await Promise.all([
    sb.from("heroes_state").select("*").eq("user_id", uid).single(),
    sb.from("inventory").select("*").eq("user_id", uid),
  ]);

  return Response.json({ hero: h2.data?.data, inventory: inv2.data ?? [] });
}
