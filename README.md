# Lumagen Life Sciences – Expense Tracker

Internal expense tracking app for **Hardik Patil** and **Vishal Shelke**.

## Features
- Secure login for both partners
- Shared view of all expenses
- Add expense with date, paid by, category, description, vendor, amount, payment method, business purpose
- Upload payment screenshot (image/PDF)
- Dashboard with totals for Hardik, Vishal and Grand Total
- Delete expenses
- Completely free to run on free tiers

## Tech Stack
- Next.js + TypeScript + Tailwind CSS
- Supabase (Auth + PostgreSQL + Storage)
- Deployed on Vercel (free)

---

## Step-by-step Setup (100% Free)

### 1. Create a free Supabase project
1. Go to https://supabase.com and sign up / log in
2. Click **New Project**
3. Name it `lumagen-expenses`
4. Set a strong database password (save it)
5. Choose region closest to India (e.g. Singapore or Mumbai if available)
6. Wait ~2 minutes for the project to be ready

### 2. Create the database table
1. In Supabase dashboard go to **SQL Editor**
2. Paste and run this SQL:

```sql
-- Create expenses table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null,
  paid_by text not null check (paid_by in ('Hardik Patil', 'Vishal Shelke')),
  category text not null,
  description text not null,
  vendor text,
  amount numeric(12,2) not null,
  payment_method text not null,
  business_purpose text,
  screenshot_url text,
  created_by uuid references auth.users(id)
);

-- Enable Row Level Security
alter table public.expenses enable row level security;

-- Policy: both authenticated users can do everything
create policy "Authenticated users full access"
  on public.expenses
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

### 3. Create Storage bucket for screenshots
1. Go to **Storage** → **New bucket**
2. Name: `receipts`
3. Make it **Public** (so screenshots can be viewed)
4. Click Create

Then go to Policies and add:

```sql
create policy "Authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'receipts');

create policy "Public read"
  on storage.objects for select
  to public
  using (bucket_id = 'receipts');
```

### 4. Create the two user accounts
1. Go to **Authentication** → **Users** → **Add user**
2. Create first user:
   - Email: `Patilhardik367@gmail.com`
   - Password: (choose a strong password and share only with Hardik)
3. Create second user:
   - Email: `shelkevpatil@gmail.com`
   - Password: (choose a strong password and share only with Vishal)

### 5. Get your API keys
1. Go to **Project Settings** → **API**
2. Copy:
   - Project URL
   - `anon` `public` key

### 6. Deploy on Vercel (Recommended)

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → New Project → Import the repo
3. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
4. Click Deploy

After deployment both of you can log in and start using the app immediately.

---

If you face any issue, just reply with the error or screenshot and I will help you.
