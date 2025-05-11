create table users (
  id bigint primary key generated always as identity,
  name text not null,
  email text unique not null,
  currency text not null
);

create table categories (
  id bigint primary key generated always as identity,
  user_id bigint references users (id) on delete cascade,
  name text not null
);

create table income_sources (
  id bigint primary key generated always as identity,
  user_id bigint references users (id) on delete cascade,
  name text not null,
  amount numeric not null
);

create table fixed_expenses (
  id bigint primary key generated always as identity,
  user_id bigint references users (id) on delete cascade,
  category_id bigint references categories (id) on delete
  set
    null,
    name text not null,
    amount numeric not null
);