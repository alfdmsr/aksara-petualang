"usee client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ItemCard(props: {
  name: string;
  price: number;
  img?: string;
  owned: boolean;
  equipped?: boolean;
  onBuy: () => void;
  onEquip: () => void;
}) {
  const { name, price, img, owned, equipped, onBuy, onEquip } = props;
  return (
    <Card className="p-3">
      {img ? (
        <img src={img} alt={name} className="w-full aspect-square rounded " />
      ) : (
        <div className="aspect-square bg-gray-100 rounded" />
      )}
      <div className="mt-2 font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">{price} coins</div>
      <div className="mt-2">
        {!owned ? (
          <Button className="w-full" onClick={onBuy}>
            Buy
          </Button>
        ) : equipped ? (
          <div className="text-xs font-semibold">Equipped</div>
        ) : (
          <Button variant="secondary" className="w-full" onClick={onEquip}>
            Equip
          </Button>
        )}
      </div>
    </Card>
  );
}
