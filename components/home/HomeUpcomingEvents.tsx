"use client";

import type { Event } from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

function formatCardDate(
  start: string,
  end: string | null,
  timeZone?: string | null
): string {
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(timeZone ? { timeZone } : {}),
  };
  const startDate = new Date(start);
  const startStr = startDate.toLocaleDateString("en-AU", opts);
  if (!end) return startStr;
  const endDate = new Date(end);
  const sameDayOpts: Intl.DateTimeFormatOptions = {
    ...(timeZone ? { timeZone } : {}),
  };
  if (
    startDate.toLocaleDateString("en-AU", sameDayOpts) ===
    endDate.toLocaleDateString("en-AU", sameDayOpts)
  ) {
    return startStr;
  }
  return `${startStr} – ${endDate.toLocaleDateString("en-AU", opts)}`;
}

const DRAG_THRESHOLD = 8;
/** Slow drift across the cookie row (px per second). */
const AUTO_SCROLL_PX_PER_SEC = 40;

function BiscuitCard({
  event,
  isChoc,
  inert,
}: {
  event: Event;
  isChoc: boolean;
  inert?: boolean;
}) {
  return (
    <li
      className="w-[min(78vw,22rem)] shrink-0 md:w-[min(42vw,24rem)]"
      aria-hidden={inert || undefined}
    >
      <Link
        href={`/events?focus=${encodeURIComponent(event.id)}`}
        draggable={false}
        tabIndex={inert ? -1 : undefined}
        className={`biscuit-card flex h-[14rem] select-none flex-col px-8 py-6 md:h-[16rem] md:px-9 md:py-7 ${
          isChoc ? "biscuit-card--choc" : "biscuit-card--dough"
        }`}
      >
        <time
          dateTime={event.start_at}
          className={`text-sm font-semibold ${
            isChoc ? "text-[#f4d2a9]/80" : "text-[#54413e]/75"
          }`}
        >
          {formatCardDate(event.start_at, event.end_at, event.timezone)}
        </time>
        <h3 className="mt-3 font-display text-xl font-bold leading-snug md:text-2xl">
          {event.title}
        </h3>
        <p
          className={`mt-2 text-sm font-medium ${
            isChoc ? "text-[#f4d2a9]/85" : "text-[#54413e]/80"
          }`}
        >
          {event.venue_name}
        </p>
        <div className="relative mt-3 flex-1 overflow-hidden">
          <p
            className={`text-sm ${
              isChoc ? "text-[#f4d2a9]/70" : "text-[#54413e]/65"
            }`}
          >
            {event.description}
          </p>
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 ${
              isChoc
                ? "bg-gradient-to-b from-transparent to-[#54413e]"
                : "bg-gradient-to-b from-transparent to-[#f4d2a9]"
            }`}
          />
        </div>
      </Link>
    </li>
  );
}

function BiscuitSet({
  events,
  setRef,
  inert,
  className = "",
}: {
  events: Event[];
  setRef?: React.Ref<HTMLUListElement>;
  inert?: boolean;
  className?: string;
}) {
  return (
    <ul
      ref={setRef}
      className={`flex gap-8 pl-8 md:gap-10 md:pl-16 lg:pl-24 ${className}`}
      aria-hidden={inert || undefined}
    >
      {events.map((event, i) => (
        <BiscuitCard
          key={`${event.id}-${inert ? "b" : "a"}`}
          event={event}
          isChoc={i % 2 === 0}
          inert={inert}
        />
      ))}
    </ul>
  );
}

export function HomeUpcomingEvents({ events }: { events: Event[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const setARef = useRef<HTMLUListElement>(null);
  const hoverPaused = useRef(false);
  const touchPaused = useRef(false);
  const drag = useRef({
    active: false,
    dragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
  });

  const wrapScrollLeft = useCallback((el: HTMLDivElement, next: number) => {
    const loopWidth = setARef.current?.offsetWidth ?? 0;
    if (loopWidth <= 1) {
      el.scrollLeft = next;
      return;
    }
    let value = next;
    while (value >= loopWidth) value -= loopWidth;
    while (value < 0) value += loopWidth;
    el.scrollLeft = value;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || e.button !== 0) return;

    if (e.pointerType !== "mouse") {
      touchPaused.current = true;
      return;
    }

    // Mouse: custom drag-to-scroll.
    drag.current = {
      active: true,
      dragging: false,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollerRef.current;
      const state = drag.current;
      if (!el || !state.active || e.pointerId !== state.pointerId) return;

      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      if (!state.dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
          return;
        }
        // Vertical intent — abandon custom drag so the page can scroll.
        if (Math.abs(dy) >= Math.abs(dx)) {
          state.active = false;
          state.pointerId = -1;
          return;
        }
        state.dragging = true;
        el.setPointerCapture(e.pointerId);
        el.style.cursor = "grabbing";
      }

      wrapScrollLeft(el, state.scrollLeft - dx);
    },
    [wrapScrollLeft]
  );

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") {
      touchPaused.current = false;
      return;
    }

    const el = scrollerRef.current;
    const state = drag.current;
    if (!el || e.pointerId !== state.pointerId) return;

    if (state.dragging) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }

    state.active = false;
    state.pointerId = -1;
    el.style.cursor = "grab";
    // Keep dragging=true until clickCapture can suppress the post-drag click
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.dragging) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.dragging = false;
    }
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || events.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      const interacting =
        hoverPaused.current ||
        touchPaused.current ||
        drag.current.active ||
        drag.current.dragging;
      if (!interacting) {
        const loopWidth = setARef.current?.offsetWidth ?? 0;
        if (loopWidth > 1) {
          wrapScrollLeft(
            el,
            el.scrollLeft + (AUTO_SCROLL_PX_PER_SEC * dt) / 1000
          );
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [events.length, wrapScrollLeft]);

  if (events.length === 0) return null;

  return (
    <section
      className="bg-white pb-16 pt-14 md:pb-24 md:pt-15"
      aria-label="Upcoming markets and events"
    >
      <div className="ml-8 md:ml-16 lg:ml-24">
        <h2 className="font-display text-2xl font-bold text-cocoa md:text-3xl">
          Upcoming markets &amp; events
        </h2>
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onMouseEnter={() => {
          hoverPaused.current = true;
        }}
        onMouseLeave={() => {
          hoverPaused.current = false;
        }}
      >
        <div className="flex w-max">
          <BiscuitSet events={events} setRef={setARef} />
          <BiscuitSet events={events} inert className="pr-10 md:pr-12" />
        </div>
      </div>
    </section>
  );
}
