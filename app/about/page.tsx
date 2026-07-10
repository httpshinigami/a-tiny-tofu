import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PageFrame>
      <h1 className="text-3xl font-bold tracking-tight text-periwinkle md:text-4xl">
        About World of Tiny Tofu
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        World of Tiny Tofu is your cosy guide to Melbourne&apos;s cutest hidden
        gems — from artist markets and collectible shops to themed events and
        whimsical cafes. Browse by month, explore the map, and find your next
        adventure.
      </p>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        Know a spot we should feature?{" "}
        <a href="/submit" className="font-medium text-sage-dark underline">
          Submit your hidden gem
        </a>{" "}
        and we&apos;ll review it for the site.
      </p>
      <div className="mt-8">
        <KawaiiButton href="/events" variant="sage">
          Start exploring
        </KawaiiButton>
      </div>
    </PageFrame>
  );
}
