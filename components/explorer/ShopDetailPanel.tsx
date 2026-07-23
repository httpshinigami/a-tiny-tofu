import { TagChip } from "@/components/shops/TagChip";
import { SafeExternalLink } from "@/components/ui/SafeExternalLink";
import { formatDisplayAddress } from "@/lib/format-address";
import { toSafeHttpHref } from "@/lib/safe-url";
import { sortShopTags } from "@/lib/shop-filter-categories";
import type { Shop } from "@/lib/types";

export function ShopDetailPanel({ shop }: { shop: Shop | null }) {
  if (!shop) {
    return (
      <p className="text-center text-ink-muted">
        Pick a shop from the list or use filters to explore the map.
      </p>
    );
  }

  const website = toSafeHttpHref(shop.website);
  const tags = sortShopTags(shop.shop_tags);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink">{shop.name}</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
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
      {website && (
        <div className="mt-2 text-sm text-ink-muted">
          <span>Website:</span>
          <p className="mt-0.5">
            <SafeExternalLink
              href={website}
              className="break-all text-sage-dark underline hover:text-sage"
            >
              {website}
            </SafeExternalLink>
          </p>
        </div>
      )}
    </div>
  );
}
