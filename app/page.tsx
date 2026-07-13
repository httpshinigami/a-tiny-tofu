import { MeltyAwning } from "@/components/home/MeltyAwning";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-mint flex w-full flex-col overflow-hidden">
      <MeltyAwning className="relative z-20 shrink-0" />

      <section className="relative z-0 -mt-14 flex h-[min(55vh,520px)] flex-col pt-14 md:-mt-16 md:h-[min(58vh,560px)] md:pt-16">
        {/* Right panel polka dots — staggered rows (zig-zag) */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[35%] md:block"
          style={{
            backgroundImage: [
              "radial-gradient(circle, rgba(87, 69, 69, 0.09) 16px, transparent 17px)",
              "radial-gradient(circle, rgba(87, 69, 69, 0.09) 16px, transparent 17px)",
            ].join(", "),
            backgroundSize: "120px 240px",
            backgroundPosition: "0 0, 60px 120px",
          }}
          aria-hidden
        />

        {/* Vertical divider */}
        <div
          className="pointer-events-none absolute inset-y-0 left-[65%] hidden w-10 bg-white md:block"
          aria-hidden
        />

        {/* Door — sits on the floor, left of the divider */}
        <div
          className="pointer-events-none absolute bottom-0 right-[42%] z-[5] hidden h-56 w-40 rounded-t-full bg-[#4a3f38] sm:h-72 sm:w-48 md:block md:h-[22rem] md:w-56"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 md:px-8 md:py-12">
          <div className="max-w-md md:w-[42%]">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
              Discover everything cute in Melbourne
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-lg">
              Markets, collectible shops, sweet treats, and whimsical little
              spots, all in one cosy place.
            </p>
            <Link
              href="/events"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-peach px-6 py-3 text-base font-semibold text-ink transition hover:bg-peach-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach-dark"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
