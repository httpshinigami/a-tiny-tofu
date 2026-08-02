"use client";

import { getInstagramIframeSrc } from "@/lib/instagram-url";
import { SafeExternalLink } from "@/components/ui/SafeExternalLink";

interface Props {
  url: string;
}

/** Approximate Instagram embed chrome heights (px) for cropping to media. */
const HEADER_CROP = 58;
const FOOTER_CROP = 72;

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
    <div
      className="instagram-embed-host relative aspect-square w-full max-w-full overflow-hidden rounded-md bg-black/5"
    >
      <iframe
        src={iframeSrc}
        title="Instagram media"
        className="absolute left-0 w-full max-w-none border-0"
        style={{
          top: -HEADER_CROP,
          height: `calc(100% + ${HEADER_CROP + FOOTER_CROP}px)`,
        }}
        loading="lazy"
        scrolling="no"
        allow="encrypted-media; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      />
      <SafeExternalLink
        href={url}
        className="absolute bottom-2 right-2 z-10 rounded-md bg-white/90 p-1.5 text-ink shadow-sm transition hover:bg-white"
      >
        <span className="sr-only">View on Instagram</span>
        <InstagramIcon />
      </SafeExternalLink>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden
    >
      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
    </svg>
  );
}
