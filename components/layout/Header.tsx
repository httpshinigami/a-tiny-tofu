"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    href: "/events",
    label: "Markets & Events",
    activeClass: "bg-pink text-ink",
  },
  {
    href: "/shops",
    label: "Shops",
    activeClass: "bg-pink text-ink",
  },
  {
    href: "/food",
    label: "Food & Drink",
    activeClass: "bg-pink text-ink",
  },
  {
    href: "/about",
    label: "About",
    activeClass: "bg-pink text-ink",
  },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white px-4 py-3 md:px-8 md:py-5">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 md:gap-4">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-ink transition hover:text-sage-dark md:text-lg"
        >
          World of Tiny Tofu
        </Link>

        <ul className="order-3 flex w-full flex-wrap justify-center gap-2 text-sm font-medium text-ink md:order-none md:w-auto md:flex-1 md:justify-center md:gap-2">
          {navLinks.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-9 items-center rounded-md px-3 py-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage ${
                    active
                      ? l.activeClass
                      : "hover:bg-border/40 hover:text-sage-dark"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/submit"
          className="rounded-md bg-mint px-4 py-2.5 text-sm font-semibold text-ink transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          Submit a spot
        </Link>
      </nav>
    </header>
  );
}
