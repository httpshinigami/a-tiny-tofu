import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PageFrame className="max-w-6xl">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-10 lg:gap-14">
        <div className="min-w-0 max-w-4xl flex-1">
          <h1 className="hidden text-3xl font-bold tracking-tight text-cocoa md:block md:text-4xl">
            About World of Tiny Tofu...
          </h1>
          <p className="leading-relaxed text-ink-muted md:mt-4">
            hello everynyan!
          </p>
          <p className="mt-4 leading-relaxed text-ink-muted">
            is this thing on?? umm, yk i love art markets, and i love niche hobby
            shops, and i love sweet treats, and i love whimsical little spots, and
            i love melbourne, and i love the internet, and i love ALL YOU NICHE HOBBY LOVERS.
          </p>
          <p className="mt-4 leading-relaxed text-ink-muted">
            woah.. maybe im coming off 2 strong ?? but it was getting sooo
            overwhelming to keep up with everything! so i made this little corner
            of the internet to gather all of these things in one place. its a
            product of my love and passion, and i hope you love it too ♡
          </p>
          <p className="mt-4 leading-relaxed text-ink-muted">
            so this brings me and YOU to where we are now... if you want to add
            your fav spots or just say hi, please do so! i&apos;ll be making an ig
            page and adding more features soon!
          </p>
          <p className="mt-8 leading-relaxed text-ink-muted">
            {" "}
            <a href="/submit" className="font-medium text-sage-dark underline">
              Submit your hidden gem
            </a>{" "}
            and we are going to make a map of the world of tiny tofu togetherrrr...!
          </p>
          <div className="mt-8">
            <KawaiiButton href="/events" variant="primary">
              Start exploring
            </KawaiiButton>
          </div>
        </div>

        <div
          className="pointer-events-none flex shrink-0 flex-col items-center gap-6 text-cocoa md:translate-x-10 md:items-end md:pt-6 lg:translate-x-20"
          aria-hidden
        >
          <MusicNotesIcon className="size-40 rotate-15 sm:size-48 md:size-56 lg:size-72" />
          <MusicNoteIcon className="size-28 -rotate-8 self-end sm:size-32 md:size-40 md:translate-x-20 lg:size-48 lg:translate-x-28" />
        </div>
      </div>
    </PageFrame>
  );
}

function MusicNotesIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
    >
      <path d="M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V110.25l112-28v51.83A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,93.75V62.25l112-28v31.5ZM180,184a20,20,0,1,1,20-20A20,20,0,0,1,180,184Z" />
    </svg>
  );
}

function MusicNoteIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
    >
      <path d="M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A48,48,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34ZM88,216a32,32,0,1,1,32-32A32,32,0,0,1,88,216ZM200,101.25l-64-19.2V50.75L200,70Z" />
    </svg>
  );
}
