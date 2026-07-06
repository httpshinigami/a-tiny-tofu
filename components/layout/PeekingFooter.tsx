export function PeekingFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-surface px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center text-sm text-ink-muted md:flex-row md:justify-between md:text-left">
        <p className="font-medium text-ink">World of Tiny Tofu · Melbourne</p>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a href="/events" className="transition hover:text-sage-dark">
            Markets & Events
          </a>
          <a href="/shops" className="transition hover:text-sage-dark">
            Shops
          </a>
          <a href="/food" className="transition hover:text-sage-dark">
            Food & Drink
          </a>
          <a href="/submit/event" className="transition hover:text-sage-dark">
            Submit
          </a>
          <a href="/about" className="transition hover:text-sage-dark">
            About
          </a>
        </nav>
      </div>
    </footer>
  );
}
