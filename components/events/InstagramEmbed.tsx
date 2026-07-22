"use client";

import { getInstagramIframeSrc } from "@/lib/instagram-url";
import { SafeExternalLink } from "@/components/ui/SafeExternalLink";

interface Props {
  url: string;
}

const EMBED_WIDTH = 326;
const EMBED_HEIGHT = 540;

export function InstagramEmbed({ url }: Props) {
  const iframeSrc = getInstagramIframeSrc(url);

  if (!iframeSrc) {
    return (
      <p className="text-sm text-ink-muted">
        Could not load this Instagram post.{" "}
        <SafeExternalLink href={url} className="text-sage-dark underline">
          Open on Instagram
        </SafeExternalLink>
      </p>
    );
  }

  return (
    <div className="instagram-embed-host w-[326px] max-w-full shrink-0">
      <iframe
        src={iframeSrc}
        title="Instagram post"
        width={EMBED_WIDTH}
        height={EMBED_HEIGHT}
        className="block w-full border-0"
        loading="lazy"
        scrolling="no"
        allow="encrypted-media"
      />
    </div>
  );
}
