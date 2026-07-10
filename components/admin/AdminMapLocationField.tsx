"use client";

interface Props {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function AdminMapLocationField({
  defaultValue,
  value,
  onChange,
}: Props) {
  const controlled = value !== undefined;

  return (
    <div>
      <label className="kawaii-label" htmlFor="map_location">
        Map location{" "}
        <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <input
        id="map_location"
        name="map_location"
        {...(controlled
          ? {
              value,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                onChange?.(e.target.value),
            }
          : { defaultValue })}
        placeholder="-37.8136, 144.9631"
        className="kawaii-input"
      />
      <p className="mt-1 text-xs text-ink-muted">
        Lat, lng in one field. Leave blank to geocode from the address.
        Choosing an address suggestion fills this automatically.
      </p>
    </div>
  );
}
