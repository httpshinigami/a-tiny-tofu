import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";

export default function HomePage() {
  return (
    <PageFrame className="mx-auto max-w-3xl text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-coral">
        Melbourne
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">
        a tiny tofu
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-lg text-ink-muted">
        Your cosy guide to cute art events and kawaii shops across Melbourne —
        browse by month, explore the map, and find your next adventure.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <KawaiiButton href="/events">Events</KawaiiButton>
        <KawaiiButton href="/shops" variant="secondary">
          Shops
        </KawaiiButton>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <KawaiiButton href="/submit/event" variant="ghost">
          Submit event
        </KawaiiButton>
        <KawaiiButton href="/submit/shop" variant="ghost">
          Submit shop
        </KawaiiButton>
      </div>
    </PageFrame>
  );
}
