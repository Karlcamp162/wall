## Supabase Setup

1. Create a Supabase project and copy the Project URL and anon key.
2. In local dev, create a file `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. In Supabase SQL editor, create the table and policies:

```sql
create table if not exists messages (
  id bigserial primary key,
  name text not null check (char_length(name) <= 100),
  text text not null check (char_length(text) <= 280),
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table messages enable row level security;

-- Public can read and insert (demo). Tighten later with auth.
create policy "Public read" on messages for select using (true);
create policy "Public insert" on messages for insert with check (true);

-- Realtime
alter publication supabase_realtime add table messages;
```

4. On Vercel, add environment variables to the project settings with the same names.

The app writes to `messages` and streams realtime inserts to update the feed instantly.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
