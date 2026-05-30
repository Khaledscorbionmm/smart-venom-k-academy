-- Smart Venom K Academy — Database Migration
-- Run this once on a fresh PostgreSQL database to create all tables.
-- Railway: add this as a one-time setup command or run via psql.

-- ───── Enums ─────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE role AS ENUM ('student', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lang_pref AS ENUM ('ar', 'en');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE category AS ENUM ('programming', 'human_language');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ───── Session store (connect-pg-simple) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS "session" (
  "sid"    varchar NOT NULL COLLATE "default",
  "sess"   json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- ───── Users ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id                  serial PRIMARY KEY,
  username            text NOT NULL UNIQUE,
  email               text NOT NULL UNIQUE,
  password_hash       text NOT NULL,
  role                role NOT NULL DEFAULT 'student',
  xp                  integer NOT NULL DEFAULT 0,
  level               integer NOT NULL DEFAULT 1,
  streak              integer NOT NULL DEFAULT 0,
  longest_streak      integer NOT NULL DEFAULT 0,
  last_activity_date  text,
  last_login_at       timestamp,
  last_login_ip       text,
  login_location      text,
  language_preference lang_pref NOT NULL DEFAULT 'ar',
  avatar_url          text,
  created_at          timestamp NOT NULL DEFAULT now(),
  updated_at          timestamp NOT NULL DEFAULT now()
);

-- ───── Courses ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS courses (
  id                     serial PRIMARY KEY,
  slug                   text NOT NULL UNIQUE,
  title_ar               text NOT NULL,
  title_en               text NOT NULL,
  description_ar         text,
  description_en         text,
  language               text NOT NULL,
  category               category NOT NULL DEFAULT 'programming',
  price                  numeric(10,2) NOT NULL DEFAULT 0,
  icon                   text NOT NULL DEFAULT '💻',
  color                  text NOT NULL DEFAULT '#6366f1',
  is_free_trial_available boolean NOT NULL DEFAULT true,
  is_active              boolean NOT NULL DEFAULT true,
  sort_order             integer NOT NULL DEFAULT 0
);

-- ───── Chapters ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS chapters (
  id             serial PRIMARY KEY,
  course_id      integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title_ar       text NOT NULL,
  title_en       text NOT NULL,
  description_ar text,
  description_en text,
  "order"        integer NOT NULL DEFAULT 0
);

-- ───── Lessons ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lessons (
  id           serial PRIMARY KEY,
  chapter_id   integer NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title_ar     text NOT NULL,
  title_en     text NOT NULL,
  content_ar   text NOT NULL DEFAULT '',
  content_en   text NOT NULL DEFAULT '',
  code_example text,
  language     text NOT NULL DEFAULT 'python',
  video_url_ar text,
  video_url_en text,
  audio_url_ar text,
  audio_url_en text,
  xp_reward    integer NOT NULL DEFAULT 50,
  "order"      integer NOT NULL DEFAULT 0,
  is_free      boolean NOT NULL DEFAULT false
);

-- ───── Quiz Questions ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quiz_questions (
  id                serial PRIMARY KEY,
  lesson_id         integer NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_ar       text NOT NULL,
  question_en       text NOT NULL,
  options           jsonb NOT NULL,
  correct_option_id text NOT NULL,
  explanation_ar    text,
  explanation_en    text,
  xp_reward         integer NOT NULL DEFAULT 20,
  "order"           integer NOT NULL DEFAULT 0
);

-- ───── Subscriptions ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
  id          serial PRIMARY KEY,
  user_id     integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status      subscription_status NOT NULL DEFAULT 'pending',
  created_at  timestamp NOT NULL DEFAULT now(),
  approved_at timestamp,
  approved_by integer
);

-- ───── User Progress ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_progress (
  id           serial PRIMARY KEY,
  user_id      integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id    integer NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at timestamp NOT NULL DEFAULT now(),
  xp_earned    integer NOT NULL DEFAULT 0,
  quiz_score   integer,
  passed       boolean NOT NULL DEFAULT false
);

-- ───── Achievements ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS achievements (
  id             serial PRIMARY KEY,
  name_ar        text NOT NULL,
  name_en        text NOT NULL,
  description_ar text NOT NULL,
  description_en text NOT NULL,
  icon           text NOT NULL DEFAULT '🏆',
  xp_required    integer NOT NULL DEFAULT 0,
  sort_order     integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id             serial PRIMARY KEY,
  user_id        integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id integer NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at      timestamp NOT NULL DEFAULT now()
);

-- ───── Activity Log ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_log (
  id         serial PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       text NOT NULL,
  title_ar   text NOT NULL,
  title_en   text NOT NULL,
  xp_earned  integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now()
);

-- ───── User Logins ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_logins (
  id         serial PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ip_address text,
  location   text,
  user_agent text,
  created_at timestamp NOT NULL DEFAULT now()
);

-- ───── Admin User (upsert) ────────────────────────────────────────────────────
-- Password: SmartVenom@2026
-- Hash generated with bcrypt cost 12

INSERT INTO users (username, email, password_hash, role, xp, level, language_preference)
VALUES (
  'admin',
  'admin@smartvenomk.com',
  'b2$e7joUidxrDBcAa5JE9JEJuMUQTIX6OUz2W9XfxGqH5/ZMngrl3tpi',
  'admin',
  9999,
  10,
  'ar'
)
ON CONFLICT (email) DO UPDATE SET
  role          = 'admin',
  password_hash = 'b2$e7joUidxrDBcAa5JE9JEJuMUQTIX6OUz2W9XfxGqH5/ZMngrl3tpi',
  updated_at    = NOW();

SELECT id, email, role FROM users WHERE email = 'admin@smartvenomk.com';
