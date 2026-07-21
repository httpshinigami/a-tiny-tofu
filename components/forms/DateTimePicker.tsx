"use client";

import { RequiredMark } from "@/components/ui/RequiredMark";
import { format, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface Props {
  id?: string;
  name: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  /** ISO string or datetime-local value */
  defaultValue?: string;
  /** IANA timezone for interpreting stored UTC values (e.g. Australia/Melbourne) */
  timeZone?: string;
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0")
);
const PERIODS = ["am", "pm"] as const;

type Period = (typeof PERIODS)[number];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function to24Hour(hour12: number, period: Period): number {
  if (period === "am") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function from24Hour(hour24: number): { hour12: number; period: Period } {
  const period: Period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

function buildTime(hour12: number, minute: number, period: Period): string {
  return `${pad(to24Hour(hour12, period))}:${pad(minute)}`;
}

function splitValue(
  value?: string,
  timeZone?: string
): { date?: Date; time: string } {
  if (!value) return { time: "" };
  const instant = new Date(value);
  if (!isValid(instant)) return { time: "" };
  const d = timeZone ? toZonedTime(instant, timeZone) : instant;
  const snapped = Math.round(d.getMinutes() / 5) * 5;
  const minutes = snapped === 60 ? 0 : snapped;
  const hours = snapped === 60 ? (d.getHours() + 1) % 24 : d.getHours();
  return {
    date: d,
    time: `${pad(hours)}:${pad(minutes)}`,
  };
}

function combineValue(date: Date | undefined, time: string): string {
  if (!date || !time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "";
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  if (!isValid(combined)) return "";
  return `${combined.getFullYear()}-${pad(combined.getMonth() + 1)}-${pad(combined.getDate())}T${pad(combined.getHours())}:${pad(combined.getMinutes())}`;
}

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return time;
  const { hour12, period } = from24Hour(h);
  return `${hour12}:${pad(m)} ${period}`;
}

export function DateTimePicker({
  id,
  name,
  label,
  required = false,
  optional = false,
  defaultValue,
  timeZone,
}: Props) {
  const reactId = useId();
  const dateId = id ? `${id}-date` : `${reactId}-date`;
  const timeId = id ? `${id}-time` : `${reactId}-time`;
  const initial = splitValue(defaultValue, timeZone);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(initial.date);
  const [time, setTime] = useState(initial.time);
  const rootRef = useRef<HTMLDivElement>(null);
  const validityRef = useRef<HTMLInputElement>(null);

  const combined = combineValue(date, time);
  const hour24 = time ? Number(time.split(":")[0]) : NaN;
  const minute = time ? (time.split(":")[1] ?? "") : "";
  const { hour12, period } = Number.isFinite(hour24)
    ? from24Hour(hour24)
    : { hour12: 0, period: "am" as Period };

  useEffect(() => {
    const el = validityRef.current;
    if (!el) return;
    if (required && !combined) {
      el.setCustomValidity("Please select a date and time");
    } else if (!required && date && !time) {
      el.setCustomValidity("Please select a time, or clear the date");
    } else {
      el.setCustomValidity("");
    }
  }, [required, combined, date, time]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setDateOpen(false);
        setTimeOpen(false);
      }
    }
    if (!dateOpen && !timeOpen) return;
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dateOpen, timeOpen]);

  function setHour12(nextHour: string) {
    const h = Number(nextHour);
    const currentPeriod = time
      ? from24Hour(Number(time.split(":")[0])).period
      : "am";
    const m = minute ? Number(minute) : 0;
    setTime(buildTime(h, m, currentPeriod));
  }

  function setMinute(nextMinute: string) {
    const current = time
      ? from24Hour(Number(time.split(":")[0]))
      : { hour12: 10, period: "am" as Period };
    setTime(buildTime(current.hour12, Number(nextMinute), current.period));
  }

  function setPeriod(nextPeriod: Period) {
    const current = time
      ? from24Hour(Number(time.split(":")[0]))
      : { hour12: 10, period: nextPeriod };
    const m = minute ? Number(minute) : 0;
    setTime(buildTime(current.hour12, m, nextPeriod));
    setTimeOpen(false);
  }

  return (
    <div ref={rootRef} className="space-y-1">
      <p className="kawaii-label">
        {label}
        {required && <RequiredMark />}
        {optional && (
          <span className="font-normal text-ink-muted"> (optional)</span>
        )}
      </p>
      <input type="hidden" name={name} value={combined} />
      <input
        ref={validityRef}
        type="text"
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        value={combined}
        onChange={() => {}}
      />
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[10rem] flex-1">
          <label htmlFor={dateId} className="sr-only">
            Date
          </label>
          <button
            id={dateId}
            type="button"
            aria-expanded={dateOpen}
            onClick={() => {
              setDateOpen((v) => !v);
              setTimeOpen(false);
            }}
            className="kawaii-input flex w-full items-center justify-between gap-2 text-left"
          >
            <span className={date ? "text-ink" : "text-ink-muted"}>
              {date ? format(date, "PPP") : "Select date"}
            </span>
            <ChevronDown />
          </button>
          {dateOpen && (
            <div className="absolute z-30 mt-2 border border-border bg-surface p-3 shadow-lg">
              <DayPicker
                mode="single"
                selected={date}
                defaultMonth={date}
                onSelect={(next) => {
                  setDate(next);
                  if (next && !time) setTime(buildTime(10, 0, "am"));
                  setDateOpen(false);
                }}
                className="rdp-tofu"
              />
              {!required && date && (
                <button
                  type="button"
                  className="mt-2 w-full rounded-lg px-2 py-1.5 text-xs font-semibold text-ink-muted transition hover:bg-surface hover:text-ink"
                  onClick={() => {
                    setDate(undefined);
                    setTime("");
                    setDateOpen(false);
                  }}
                >
                  Clear date
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative w-40 shrink-0">
          <label htmlFor={timeId} className="sr-only">
            Time
          </label>
          <button
            id={timeId}
            type="button"
            aria-expanded={timeOpen}
            onClick={() => {
              setTimeOpen((v) => !v);
              setDateOpen(false);
            }}
            className="kawaii-input flex w-full items-center justify-between gap-2 text-left"
          >
            <span className={time ? "text-ink" : "text-ink-muted"}>
              {time ? formatTimeLabel(time) : "Select time"}
            </span>
            <ChevronDown />
          </button>
          {timeOpen && (
            <div className="absolute right-0 z-30 mt-2 flex gap-1 border border-border bg-surface p-2 shadow-lg">
              <TimeColumn
                label="Hour"
                options={HOURS_12}
                selected={time ? String(hour12) : ""}
                onSelect={setHour12}
              />
              <TimeColumn
                label="Min"
                options={MINUTES}
                selected={minute}
                onSelect={setMinute}
              />
              <TimeColumn
                label="am/pm"
                options={[...PERIODS]}
                selected={time ? period : ""}
                onSelect={(value) => setPeriod(value as Period)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TimeColumn({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <p className="px-2 pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <ul className="max-h-48 w-14 overflow-y-auto bg-surface/60 py-1">
        {options.map((option) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => onSelect(option)}
              className={`w-full px-2 py-1.5 text-center text-sm transition ${
                selected === option
                  ? "bg-sage/20 font-semibold text-sage-dark"
                  : "text-ink hover:bg-surface"
              }`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-ink-muted"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
