import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PageFrame>
      <h1 className="text-3xl font-bold tracking-tight text-cocoa md:text-4xl">
        About World of Tiny Tofu
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        World of Tiny Tofu began with a soft spot for trinkets, tiny treasures,
        and all things cute, and a habit of falling a little in love with every
        art market, new artist, and whimsical little spot along the way.
      </p>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        Keeping up with it all got overwhelming fast. So this little corner of
        the internet was made to gather Melbourne&apos;s cutest finds in one
        place: markets, events, shops, and sweet food &amp; drink spots.
        Hopefully it makes discovering them just a bit easier for anyone who
        feels the same. ♡
      </p>
      <p className="mt-8 max-w-2xl leading-relaxed text-ink-muted">
        Know a gem we should feature?{" "}
        <a href="/submit" className="font-medium text-sage-dark underline">
          Submit your hidden gem
        </a>{" "}
        and we&apos;ll take a look.
      </p>
      <div className="mt-8">
        <KawaiiButton href="/events" variant="primary">
          Start exploring
        </KawaiiButton>
      </div>
    </PageFrame>
  );
}
