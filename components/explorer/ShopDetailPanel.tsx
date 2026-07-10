import { TagChip } from "@/components/shops/TagChip";
import { formatDisplayAddress } from "@/lib/format-address";
import type { Shop } from "@/lib/types";

export function ShopDetailPanel({ shop }: { shop: Shop | null }) {
  if (!shop) {
    return (
      <p className="text-center text-ink-muted">
        Pick a shop from the list or use filters to explore the map.
      </p>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink">{shop.name}</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {shop.shop_tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>
      <p className="mt-3 text-ink-muted">{shop.description}</p>
      <div className="mt-2 text-sm text-ink-muted">
        <span>Address:</span>
        <p className="mt-0.5">{formatDisplayAddress(shop.address)}</p>
      </div>
      {shop.hours && (
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Hours: {shop.hours}
        </p>
      )}
      {shop.website && (
        <div className="mt-2 text-sm text-ink-muted">
          <span>Website:</span>
          <p className="mt-0.5">
            <a
              href={shop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sage-dark underline hover:text-sage"
            >
              {shop.website}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
