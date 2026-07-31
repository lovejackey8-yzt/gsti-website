# GSTI · Criminal Personality Identification System

A GTA-inspired one-time marketing microsite. Users don't fill in a personality test — the city identifies who they are.

Built with Next.js 15 + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui + next-intl.

## Live Preview

- Landing → 12 CASE FILE questions → Identity analysis (3–5s) → Result → 16 Personality Library
- Hidden admin dashboard: `/admin`

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion 11
- **UI**: shadcn/ui + lucide-react
- **State**: zustand (persisted)
- **i18n**: next-intl (zh · ru/en placeholders)
- **Deploy**: Vercel

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Available Scripts

- `npm run dev` · Start development server
- `npm run build` · Production build
- `npm run start` · Start production server
- `npm run lint` · Run ESLint
- `npm run typecheck` · TypeScript check

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```
ADMIN_PASSWORD=your-secret-password
```

On Vercel, set this in **Project Settings → Environment Variables**.

## Project Structure

```
app/[locale]/           # Localized pages (landing / test / analysis / result / library)
app/admin/              # Hidden admin dashboard
app/api/                # Track events + admin auth + stats
components/             # Reusable UI (effects, layout, landing, test, result, library, admin)
data/                   # questions.json + personalities.json
locales/                # zh.json (ru/en TBD)
hooks/                  # Zustand store
utils/                  # Scoring algorithm + events store
public/                 # Hero image + 16 portraits
```

## Scoring Algorithm

4 dimensions × 2 tendencies = 16 personalities:

- **Action Style**: Impulse (I) / Calculated (C)
- **Social Style**: Lone (L) / Pack (P)
- **Moral Compass**: Rogue (R) / Principled (P)
- **Risk Appetite**: High-risk (H) / Safe (S)

Each of the 12 CASE FILE questions maps its 4 choices to a tendency tag. Scores are aggregated per dimension; the winning tendency forms a 4-letter code that matches one of 16 personalities.

## Admin Dashboard

Navigate to `/admin` and enter the password (env var `ADMIN_PASSWORD`).

You can see:
- Total participants
- Last 24h / 7d new participants
- 7-day trend chart
- 16 personality distribution ranking

## License

Proprietary · All rights reserved.
