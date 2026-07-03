import { KawaiiButton } from "@/components/ui/KawaiiButton";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-periwinkle md:text-5xl lg:text-6xl">
          Discover Melbourne&apos;s Cutest Hidden Gems
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink md:text-lg">
          Explore local artist markets, collectible stores, themed events, and
          whimsical experiences across Melbourne.
        </p>
        <div className="mt-8">
          <KawaiiButton href="/events" variant="sage">
            Explore
          </KawaiiButton>
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-sky/40 via-periwinkle-light/30 to-butter/50">
          <Image
            src="/hero-illustration.png"
            alt="Tiny characters exploring a beach together"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      </section>
    </div>
  );
}
