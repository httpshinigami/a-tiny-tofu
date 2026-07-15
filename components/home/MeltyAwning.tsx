/** Full-width chocolate awning — tiles at natural size, never stretched */
export function MeltyAwning({ className = "" }: { className?: string }) {
  const unit = 140;
  const height = 240;
  const radius = unit / 2;
  const stem = height - radius;
  const patternWidth = unit * 2;

  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ height }} aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height={height}
        shapeRendering="geometricPrecision"
      >
        <defs>
          <pattern
            id="melty-awning"
            width={patternWidth}
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <path
              fill="var(--color-cocoa)"
              d={`M0,0 H${unit} V${stem} A${radius},${radius} 0 0 1 0,${stem} Z`}
            />
            <path
              fill="var(--color-cocoa-dark)"
              d={`M${unit},0 H${patternWidth} V${stem} A${radius},${radius} 0 0 1 ${unit},${stem} Z`}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#melty-awning)" />
      </svg>
    </div>
  );
}
