"use client";

import { DateTimePicker } from "@/components/forms/DateTimePicker";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import type { EventSessionInput } from "@/lib/types";
import { format, isValid, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useId, useRef, useState } from "react";

type SessionField = EventSessionInput & { key: string };

interface Props {
  value?: EventSessionInput[];
  timeZone?: string;
}

function calendarDateFromValue(
  value?: string | null,
  timeZone?: string
): Date | undefined {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    const parsed = parse(value.slice(0, 16), "yyyy-MM-dd'T'HH:mm", new Date());
    return isValid(parsed) ? parsed : undefined;
  }
  const instant = new Date(value);
  if (!isValid(instant)) return undefined;
  const zoned = timeZone ? toZonedTime(instant, timeZone) : instant;
  return new Date(zoned.getFullYear(), zoned.getMonth(), zoned.getDate());
}

function timeFromValue(value?: string | null, timeZone?: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    return value.slice(11, 16);
  }
  const instant = new Date(value);
  if (!isValid(instant)) return "";
  const zoned = timeZone ? toZonedTime(instant, timeZone) : instant;
  const snapped = Math.round(zoned.getMinutes() / 5) * 5;
  const minutes = snapped === 60 ? 0 : snapped;
  const hours = snapped === 60 ? (zoned.getHours() + 1) % 24 : zoned.getHours();
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Keep end time, force end calendar day to match start. */
function syncEndToStartDate(
  start_at: string,
  end_at: string | null,
  timeZone?: string
): string | null {
  const startDate = calendarDateFromValue(start_at, timeZone);
  if (!startDate) return end_at;
  const endTime = timeFromValue(end_at, timeZone);
  if (!endTime) return null;
  return `${format(startDate, "yyyy-MM-dd")}T${endTime}`;
}

export function EventSessionsFields({ value, timeZone }: Props) {
  const reactId = useId();
  const nextKeyRef = useRef(0);

  function makeField(session?: EventSessionInput): SessionField {
    const start_at = session?.start_at ?? "";
    const end_at = syncEndToStartDate(
      start_at,
      session?.end_at ?? null,
      timeZone
    );
    return {
      key: `${reactId}-${nextKeyRef.current++}`,
      start_at,
      end_at,
    };
  }

  const [fields, setFields] = useState<SessionField[]>(() => {
    const initial = value?.length
      ? value
      : [{ start_at: "", end_at: null as string | null }];
    return initial.map((session) => makeField(session));
  });

  function updateStart(key: string, start_at: string) {
    setFields((prev) =>
      prev.map((field) => {
        if (field.key !== key || field.start_at === start_at) return field;
        return {
          ...field,
          start_at,
          end_at: syncEndToStartDate(start_at, field.end_at, timeZone),
        };
      })
    );
  }

  function updateEnd(key: string, end_at: string) {
    setFields((prev) =>
      prev.map((field) => {
        if (field.key !== key) return field;
        const next = end_at || null;
        if (field.end_at === next) return field;
        return {
          ...field,
          end_at: syncEndToStartDate(field.start_at, next, timeZone),
        };
      })
    );
  }

  function addField() {
    setFields((prev) => {
      const synced = prev.map((field) => ({
        ...field,
        end_at: syncEndToStartDate(field.start_at, field.end_at, timeZone),
      }));
      return [...synced, makeField()];
    });
  }

  function removeField(key: string) {
    setFields((prev) =>
      prev.length <= 1 ? prev : prev.filter((field) => field.key !== key)
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="kawaii-label">Dates & times</p>
        <p className="text-xs text-ink-muted">
          Add one row per day. End time is on the same day as start.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const startDate = calendarDateFromValue(field.start_at, timeZone);
          const isLast = index === fields.length - 1;
          return (
            <div
              key={field.key}
              className="rounded-md border border-border bg-surface p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">
                  Day {index + 1}
                </p>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(field.key)}
                    className="text-sm font-medium text-ink-muted underline hover:text-ink"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <DateTimePicker
                  id={`sessions-${field.key}-start`}
                  name={`sessions.${index}.start_at`}
                  label="Start"
                  required
                  defaultValue={field.start_at}
                  timeZone={timeZone}
                  onChange={(next) => updateStart(field.key, next)}
                />
                <div className="flex flex-wrap items-end gap-3">
                  <DateTimePicker
                    id={`sessions-${field.key}-end`}
                    name={`sessions.${index}.end_at`}
                    label="End time"
                    required
                    defaultValue={field.end_at ?? undefined}
                    timeZone={timeZone}
                    hideDate
                    fixedDate={startDate}
                    onChange={(next) => updateEnd(field.key, next)}
                  />
                  {isLast && (
                    <KawaiiButton
                      type="button"
                      variant="secondary"
                      onClick={addField}
                      className="px-4 py-2.5 text-sm"
                    >
                      Add another day
                    </KawaiiButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
