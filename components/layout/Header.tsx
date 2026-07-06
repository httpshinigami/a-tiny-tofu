import Link from "next/link";

const navLinks = [
  { href: "/shops", label: "Shops" },
  { href: "/events", label: "Markets & Events" },
  { href: "/food", label: "Food & Drink" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-border/60 bg-surface px-4 py-5 md:px-8">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-ink transition hover:text-sage-dark md:text-lg"
        >
          World of Tiny Tofu
        </Link>

        <ul className="order-3 flex w-full flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink md:order-none md:w-auto md:flex-1 md:justify-center md:gap-8">
          {navLinks.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="transition hover:text-sage-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/submit/event"
          className="rounded-xl bg-sage px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          Submit your hidden gem
        </Link>
      </nav>
    </header>
  );
}
