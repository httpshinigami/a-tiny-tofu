/** Response headers applied to all routes for XSS and clickjacking mitigation. */
export const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.instagram.com https://*.cdninstagram.com",
      "style-src 'self' 'unsafe-inline' https://www.instagram.com https://*.cdninstagram.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://*.cdninstagram.com",
      "frame-src https://www.instagram.com https://*.instagram.com",
      "connect-src 'self' https://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://*.tiles.mapbox.com https://vitals.vercel-insights.com https://www.instagram.com https://*.instagram.com https://*.cdninstagram.com",
      "worker-src 'self' blob:",
    ].join("; "),
  },
];
