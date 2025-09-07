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
  const items: Item[] = catalog.items as Item[];
  const item = items.find((i) => i.id === itemId);
  if (!item)
    return Response.json(
      { error: { code: "ITEM_NOT_FOUND" } },
      { status: 404 }
    );

  const uid = user.id;

  // 1) Ambil wallet
  const { data: w } = await sb
    .from("wallet")
    .select("*")
    .eq("user_id", uid)
    .single();
  if (!w)
    return Response.json(
      { error: { code: "WALLET_NOT_FOUND" } },
      { status: 400 }
    );

  // 2) Cek saldo
  if (w.coins < item.price) {
    return Response.json(
      { error: { code: "INSUFFICIENT_COINS" } },
      { status: 400 }
    );
  }

  // 3) Kurangi coin
  const { error: e1 } = await sb
    .from("wallet")
    .update({ coins: w.coins - item.price })
    .eq("user_id", uid);
  if (e1)
    return Response.json(
      { error: { code: "WALLET_UPDATE_FAIL" } },
      { status: 500 }
    );

  // 4) Tambah ke inventory (upsert)
  const { data: invRow } = await sb
    .from("inventory")
    .select("*")
    .eq("user_id", uid)
    .eq("item_id", itemId)
    .single();
  if (!invRow) {
    const { error: e2 } = await sb
      .from("inventory")
      .insert({ user_id: uid, item_id: itemId, qty: 1, equipped: false });
    if (e2)
      return Response.json(
        { error: { code: "INV_INSERT_FAIL" } },
        { status: 500 }
      );
  } else {
    const { error: e3 } = await sb
      .from("inventory")
      .update({ qty: invRow.qty + 1 })
      .eq("user_id", uid)
      .eq("item_id", itemId);
    if (e3)
      return Response.json(
        { error: { code: "INV_UPDATE_FAIL" } },
        { status: 500 }
      );
  }

  // 5) Kembalikan state terbaru
  const [w2, inv2] = await Promise.all([
    sb.from("wallet").select("*").eq("user_id", uid).single(),
    sb.from("inventory").select("*").eq("user_id", uid),
  ]);

  return Response.json({ wallet: w2.data, inventory: inv2.data ?? [] });
}
