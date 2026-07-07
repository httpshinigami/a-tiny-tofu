interface Props {
  defaultValue?: string;
}

export function AdminMapLocationField({ defaultValue }: Props) {
  return (
    <div>
      <label className="kawaii-label" htmlFor="map_location">
        Map location{" "}
        <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <input
        id="map_location"
        name="map_location"
        defaultValue={defaultValue}
        placeholder="-37.8136, 144.9631"
        className="kawaii-input"
      />
      <p className="mt-1 text-xs text-ink-muted">
        Lat, lng in one field. Leave blank to geocode from the address.
      </p>
    </div>
  );
}
