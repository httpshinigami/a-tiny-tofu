const NAIVE_LOCAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/** True when the value is a wall-clock datetime from DateTimePicker (no timezone). */
export function isNaiveLocalDateTime(value: string): boolean {
  return NAIVE_LOCAL_RE.test(value);
}
