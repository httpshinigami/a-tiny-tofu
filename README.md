# a tiny tofu

A cute guide to art events and kawaii shops in Melbourne. Browse events by month with an integrated map, filter shops by Monchhichi, desserts, brunch, or Smiskis, and submit listings for admin review.

## Features

- **Events** — left sidebar with expandable months; map zooms when you select an event; details below the map
- **Shops** — same layout with category filters and shop list
- **Submissions** — public forms; content hidden until approved
- **Admin** — review queue and direct publishing

## Quick start

```bash
cd a-tiny-tofu
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Supabase, demo seed data is used.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql) in the SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in keys plus `ADMIN_EMAILS`.
4. Create an admin user in Authentication matching `ADMIN_EMAILS`.

## Deploy (Vercel)

Import the `a-tiny-tofu` folder, add environment variables, and deploy.

## License

MIT
