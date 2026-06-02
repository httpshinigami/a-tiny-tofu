import Link from "next/link";

const leftLinks = [{ href: "/events", label: "Events" }];

const rightLinks = [
  { href: "/shops", label: "Shops" },
  { href: "/submit/event", label: "Submit" },
];

function Logo() {
  return (
    <Link
      href="/"
      className="flex h-12 w-12 items-center justify-center rounded-full bg-coral font-display text-sm font-bold text-white shadow-md transition hover:scale-105"
      aria-label="a tiny tofu home"
    >
      tofu
    </Link>
  );
}

export function Header() {
  return (
    <header className="px-4 py-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <ul className="flex flex-1 flex-wrap gap-4 text-sm font-semibold text-ink md:gap-6 md:text-base">
          {leftLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="transition hover:text-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Logo />
        <ul className="flex flex-1 flex-wrap justify-end gap-4 text-sm font-semibold text-ink md:gap-6 md:text-base">
          {rightLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="transition hover:text-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
