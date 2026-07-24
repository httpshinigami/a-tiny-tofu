"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="relative z-50 bg-white px-4 py-3 md:px-8 md:py-5">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 md:gap-4">
          <Link
            href="/"
            className="shrink-0 text-base font-semibold tracking-tight text-ink transition hover:text-sage-dark md:text-lg"
          >
            World of Tiny Tofu
          </Link>

          {/* Desktop nav */}
          <ul className="hidden flex-1 justify-center gap-2 text-sm font-medium text-ink md:flex">
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

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/submit"
              className="rounded-md bg-mint px-3 py-2 text-sm font-semibold text-ink transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage md:px-4 md:py-2.5"
            >
              Submit a spot
            </Link>

            <button
              type="button"
              className="inline-flex size-11 items-center justify-center text-ink transition hover:text-sage-dark md:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>

        {/* Mobile overlay menu — right half, near the hamburger */}
        {menuOpen && (
          <div
            id={menuId}
            className="absolute top-full right-0 z-50 w-1/2 min-w-[11rem] border-b border-l border-border bg-white px-3 shadow-[0_16px_32px_rgba(42,38,48,0.14)] md:hidden"
          >
            <ul className="flex flex-col gap-1 py-3 text-sm font-medium text-ink">
              {navLinks.map((l) => {
                const active =
                  pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-md px-3 py-2 transition ${
                        active
                          ? l.activeClass
                          : "hover:bg-border/40 hover:text-sage-dark"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </header>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/30 md:hidden"
          aria-label="Dismiss menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden
    >
      <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden
    >
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  );
}
