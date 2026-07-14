"use client";

import type { Event } from "@/lib/types";
import Link from "next/link";
import { useCallback, useRef } from "react";

function formatCardDate(start: string, end: string | null): string {
  const startDate = new Date(start);
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  const startStr = startDate.toLocaleDateString("en-AU", opts);
  if (!end) return startStr;
  const endDate = new Date(end);
  if (startDate.toDateString() === endDate.toDateString()) return startStr;
  return `${startStr} – ${endDate.toLocaleDateString("en-AU", opts)}`;
}

export function HomeUpcomingEvents({ events }: { events: Event[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current.active = false;
    el.style.cursor = "grab";
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }, []);

  if (events.length === 0) return null;

  return (
    <section
      className="bg-white pb-16 pt-14 md:pb-24 md:pt-15"
      aria-label="Upcoming markets and events"
    >
      <div className="ml-8 md:ml-16 lg:ml-24">
        <h2 className="font-display text-2xl font-bold text-periwinkle md:text-3xl">
          Upcoming markets &amp; events
        </h2>
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 cursor-grab touch-pan-x overflow-x-auto overscroll-x-contain active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <ul className="flex w-max snap-x snap-mandatory gap-5 pl-8 pr-10 md:gap-6 md:pl-16 md:pr-12 lg:pl-24">
          {events.map((event, i) => {
            const isChoc = i % 2 === 0;
            return (
              <li
                key={event.id}
                className="w-[min(78vw,22rem)] shrink-0 snap-start md:w-[min(42vw,24rem)]"
              >
                <Link
                  href="/events"
                  draggable={false}
                  className={`biscuit-tile flex h-full min-h-[14rem] select-none flex-col px-8 py-6 md:min-h-[16rem] md:px-9 md:py-7 ${
                    isChoc ? "biscuit-tile--choc" : "biscuit-tile--dough"
                  }`}
                >
                  <time
                    dateTime={event.start_at}
                    className={`text-sm font-semibold ${
                      isChoc ? "text-[#f4d2a9]/80" : "text-[#54413e]/75"
                    }`}
                  >
                    {formatCardDate(event.start_at, event.end_at)}
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
                  <p
                    className={`mt-auto line-clamp-2 pt-4 text-sm ${
                      isChoc ? "text-[#f4d2a9]/70" : "text-[#54413e]/65"
                    }`}
                  >
                    {event.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
