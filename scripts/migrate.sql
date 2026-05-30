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
  '$2b$12$5mtVwgsOpiP.fyF9kak5z.1b6M8uAu1n8q84y2tHcBjbIkfmYjG2K',
  'admin',
  9999,
  10,
  'ar'
)
ON CONFLICT (email) DO UPDATE SET
  role          = 'admin',
  password_hash = '$2b$12$5mtVwgsOpiP.fyF9kak5z.1b6M8uAu1n8q84y2tHcBjbIkfmYjG2K',
  updated_at    = NOW();

SELECT id, email, role FROM users WHERE email = 'admin@smartvenomk.com';

-- ───── Initial Content ───────────────────────────────────────────────────────

-- 1. Programming Course
INSERT INTO courses (slug, title_ar, title_en, description_ar, description_en, language, category, price, icon, color, is_active, sort_order)
VALUES (
  'fullstack-web',
  'دورة تطوير الويب المتكاملة',
  'Fullstack Web Development',
  'تعلم بناء تطبيقات الويب من الصفر حتى الاحتراف باستخدام أحدث التقنيات.',
  'Learn to build web applications from scratch to professional level using the latest technologies.',
  'Arabic/English',
  'programming',
  0,
  '🌐',
  '#3b82f6',
  true,
  1
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Python Chapter
INSERT INTO chapters (course_id, title_ar, title_en, "order")
SELECT id, 'أساسيات البرمجة بلغة بايثون', 'Python Programming Basics', 1
FROM courses WHERE slug = 'fullstack-web'
ON CONFLICT DO NOTHING;

-- 3. Python Lesson 1
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'مقدمة في بايثون والمغيرات', 'Introduction to Python & Variables', 
'بايثون هي لغة برمجة قوية وسهلة التعلم. المتغيرات تستخدم لتخزين البيانات. يمكنك استخدام علامة = لتعريف متغير جديد.', 
'Python is a powerful and easy-to-learn programming language. Variables are used to store data. You can use the = sign to define a new variable.', 
'# تعريف متغير\nname = "Manus"\nage = 25\nprint(f"Hello, my name is {name} and I am {age} years old.")', 
'python', 100, 1, true
FROM chapters WHERE title_en = 'Python Programming Basics'
ON CONFLICT DO NOTHING;

-- 4. Quiz for Lesson 1
INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, xp_reward, "order")
SELECT id, 'كيف نقوم بطباعة نص في بايثون؟', 'How do we print text in Python?', 
'[{"id": "0", "textAr": "print()", "textEn": "print()"}, {"id": "1", "textAr": "echo()", "textEn": "echo()"}, {"id": "2", "textAr": "console.log()", "textEn": "console.log()"}]'::jsonb, 
'0', 50, 1
FROM lessons WHERE title_en = 'Introduction to Python & Variables'
ON CONFLICT DO NOTHING;


-- 5. HTML Lesson
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'أساسيات HTML', 'HTML Basics', 
'HTML هي لغة هيكلة صفحات الويب. نستخدم الوسوم (Tags) لتعريف العناصر مثل العناوين والفقرات.', 
'HTML is the standard markup language for web pages. We use tags to define elements like headings and paragraphs.', 
'<!DOCTYPE html>\n<html>\n<body>\n  <h1>أهلاً بكم في أكاديمية سمارت فينوم</h1>\n  <p>هذا أول درس في HTML.</p>\n</body>\n</html>', 
'html', 100, 1, true
FROM chapters WHERE title_en = 'Frontend Development'
ON CONFLICT DO NOTHING;

-- 6. Quiz for HTML Lesson
INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, xp_reward, "order")
SELECT id, 'ماذا يرمز اختصار HTML؟', 'What does HTML stand for?', 
'[{"id": "0", "textAr": "Hyper Text Markup Language", "textEn": "Hyper Text Markup Language"}, {"id": "1", "textAr": "High Tech Modern Language", "textEn": "High Tech Modern Language"}, {"id": "2", "textAr": "Hyperlink and Text Management", "textEn": "Hyperlink and Text Management"}]'::jsonb, 
'0', 50, 1
FROM lessons WHERE title_en = 'HTML Basics'
ON CONFLICT DO NOTHING;

-- 7. JavaScript Lesson
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'أساسيات جافا سكريبت', 'JavaScript Basics', 
'جافا سكريبت هي لغة البرمجة التي تجعل صفحات الويب تفاعلية. يمكننا استخدامه لتغيير المحتوى والتحكم في المتصفح.', 
'JavaScript is the programming language that makes web pages interactive. We can use it to change content and control the browser.', 
'// تعريف دالة بسيطة\nfunction greet(name) {\n  return "مرحباً " + name + "!";\n}\n\nconsole.log(greet("بطل سمارت فينوم"));', 
'javascript', 120, 2, true
FROM chapters WHERE title_en = 'Frontend Development'
ON CONFLICT DO NOTHING;

-- 8. Quiz for JS Lesson
INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, xp_reward, "order")
SELECT id, 'كيف نعرف متغيراً في جافا سكريبت الحديثة؟', 'How do we define a variable in modern JavaScript?', 
'[{"id": "0", "textAr": "let أو const", "textEn": "let or const"}, {"id": "1", "textAr": "var فقط", "textEn": "var only"}, {"id": "2", "textAr": "variable", "textEn": "variable"}]'::jsonb, 
'0', 50, 1
FROM lessons WHERE title_en = 'JavaScript Basics'
ON CONFLICT DO NOTHING;

-- 9. React Lesson
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'مقدمة في React', 'Introduction to React', 
'React هي مكتبة JavaScript لبناء واجهات المستخدم. تستخدم مفهوم المكونات (Components) لإعادة استخدام الكود.', 
'React is a JavaScript library for building user interfaces. It uses the concept of components for code reuse.', 
'import React from "react";\n\nfunction App() {\n  return <h1>مرحباً بك في React!</h1>;\n}\n\nexport default App;', 
'javascript', 150, 3, true
FROM chapters WHERE title_en = 'Frontend Development'
ON CONFLICT DO NOTHING;

-- 10. Quiz for React Lesson
INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, xp_reward, "order")
SELECT id, 'ما هي المزايا الرئيسية لـ React؟', 'What are the main advantages of React?', 
'[{"id": "0", "textAr": "إعادة استخدام المكونات والأداء العالي", "textEn": "Component reusability and high performance"}, {"id": "1", "textAr": "صعوبة التعلم فقط", "textEn": "Difficult to learn only"}, {"id": "2", "textAr": "لا توجد مزايا", "textEn": "No advantages"}]'::jsonb, 
'0', 50, 1
FROM lessons WHERE title_en = 'Introduction to React'
ON CONFLICT DO NOTHING;

-- 11. Advanced Python - Functions
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الدوال في بايثون', 'Functions in Python', 
'الدوال هي كتل من الكود قابلة لإعادة الاستخدام. تساعد في تنظيم الكود وجعله أكثر وضوحاً.', 
'Functions are reusable blocks of code. They help organize code and make it clearer.', 
'def greet(name, age):\n    return f"مرحباً {name}، عمرك {age} سنة"\n\nprint(greet("أحمد", 25))', 
'python', 120, 2, false
FROM chapters WHERE title_en = 'Python Programming Basics'
ON CONFLICT DO NOTHING;

-- 12. Quiz for Functions Lesson
INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, xp_reward, "order")
SELECT id, 'كيف نعرف دالة في بايثون؟', 'How do we define a function in Python?', 
'[{"id": "0", "textAr": "باستخدام كلمة def", "textEn": "Using the def keyword"}, {"id": "1", "textAr": "باستخدام function", "textEn": "Using function"}, {"id": "2", "textAr": "باستخدام func", "textEn": "Using func"}]'::jsonb, 
'0', 50, 1
FROM lessons WHERE title_en = 'Functions in Python'
ON CONFLICT DO NOTHING;

-- 13. CSS Lesson
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'أساسيات CSS', 'CSS Basics', 
'CSS تستخدم لتنسيق صفحات الويب. يمكننا تغيير الألوان والخطوط والتخطيطات باستخدام CSS.', 
'CSS is used to style web pages. We can change colors, fonts, and layouts using CSS.', 
'body {\n  background-color: #f0f0f0;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}', 
'css', 100, 4, true
FROM chapters WHERE title_en = 'Frontend Development'
ON CONFLICT DO NOTHING;

-- 14. Quiz for CSS Lesson
INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, xp_reward, "order")
SELECT id, 'كيف نغير لون النص في CSS؟', 'How do we change text color in CSS?', 
'[{"id": "0", "textAr": "باستخدام color", "textEn": "Using color property"}, {"id": "1", "textAr": "باستخدام text-color", "textEn": "Using text-color"}, {"id": "2", "textAr": "باستخدام font-color", "textEn": "Using font-color"}]'::jsonb, 
'0', 50, 1
FROM lessons WHERE title_en = 'CSS Basics'
ON CONFLICT DO NOTHING;

-- 15. Python - Data Types
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'أنواع البيانات في بايثون', 'Data Types in Python', 
'بايثون تدعم عدة أنواع بيانات مثل الأرقام والنصوص والقوائم والقواميس.', 
'Python supports multiple data types such as numbers, strings, lists, and dictionaries.', 
'# أنواع البيانات\nname = "أحمد"  # نص\nage = 25  # رقم صحيح\nheight = 1.75  # رقم عشري\nis_student = True  # قيمة منطقية\n\nprint(type(name))\nprint(type(age))', 
'python', 100, 3, false
FROM chapters WHERE title_en = 'Python Programming Basics'
ON CONFLICT DO NOTHING;

-- 16. Quiz for Data Types
INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, xp_reward, "order")
SELECT id, 'أي من التالي ليس نوع بيانات في بايثون؟', 'Which of the following is NOT a data type in Python?', 
'[{"id": "0", "textAr": "string", "textEn": "string"}, {"id": "1", "textAr": "boolean", "textEn": "boolean"}, {"id": "2", "textAr": "character", "textEn": "character"}]'::jsonb, 
'2', 50, 1
FROM lessons WHERE title_en = 'Data Types in Python'
ON CONFLICT DO NOTHING;

