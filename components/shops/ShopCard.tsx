import { TagChip } from "@/components/shops/TagChip";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import type { Shop } from "@/lib/types";

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <article className="rounded-3xl border-2 border-peach-dark/30 bg-white/70 p-5 shadow-sm transition hover:shadow-md">
      <h2 className="font-display text-xl font-bold text-ink md:text-2xl">
        {shop.name}
      </h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {shop.shop_tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>
      <p className="mt-2 text-ink-muted">{shop.description}</p>
      <p className="mt-2 text-xs text-ink-muted">{shop.address}</p>
      {shop.hours && (
        <p className="mt-1 text-xs font-semibold text-ink-muted">
          Hours: {shop.hours}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <KawaiiButton href={`/shops/map?focus=${shop.id}`} variant="secondary">
          View on map
        </KawaiiButton>
        {shop.website && (
          <KawaiiButton href={shop.website} variant="ghost">
            Website
          </KawaiiButton>
        )}
      </div>
    </article>
  );
}
