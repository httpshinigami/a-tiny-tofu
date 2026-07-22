"use client";

import { toSafeInstagramEmbedUrl } from "@/lib/instagram-url";
import { SafeExternalLink } from "@/components/ui/SafeExternalLink";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const EMBED_SCRIPT = "https://www.instagram.com/embed.js";

function processEmbeds() {
  window.instgrm?.Embeds.process();
}

interface Props {
  url: string;
}

export function InstagramEmbed({ url }: Props) {
  const safeUrl = toSafeInstagramEmbedUrl(url);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (window.instgrm) setScriptReady(true);
  }, []);

  useEffect(() => {
    if (!scriptReady || !safeUrl) return;
    const timer = window.setTimeout(processEmbeds, 50);
    return () => window.clearTimeout(timer);
  }, [safeUrl, scriptReady]);

  if (!safeUrl) {
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
    <div key={safeUrl} className="w-full min-w-[280px]">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={safeUrl}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: 3,
          boxShadow:
            "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: 0,
          maxWidth: 540,
          minWidth: 280,
          padding: 0,
          width: "calc(100% - 2px)",
        }}
      >
        <div style={{ padding: 16 }}>
          <SafeExternalLink
            href={safeUrl}
            className="text-sm text-sage-dark underline"
          >
            View this post on Instagram
          </SafeExternalLink>
        </div>
      </blockquote>
      <Script
        id="instagram-embed-js"
        src={EMBED_SCRIPT}
        strategy="lazyOnload"
        onReady={() => {
          setScriptReady(true);
          processEmbeds();
        }}
      />
    </div>
  );
}
