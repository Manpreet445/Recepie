-- meal_plans table
-- guest_id is a client-generated UUID stored in localStorage (no auth required yet)

create table if not exists meal_plans (
  id            uuid        primary key default gen_random_uuid(),
  guest_id      text        not null,
  title         text        not null,
  goal          text        not null,
  duration_days int         not null,
  meals_per_day int         not null default 3,
  macro_targets jsonb       not null default '{}',
  plan_data     jsonb       not null default '{}',
  created_at    timestamptz not null default now()
);

create index if not exists meal_plans_guest_id_idx
  on meal_plans (guest_id, created_at desc);

-- No RLS for now — single-user guest app.
-- Add "alter table meal_plans enable row level security" when auth is added.
