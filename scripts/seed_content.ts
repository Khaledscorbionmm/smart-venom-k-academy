
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set!");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    console.log("🌱 Seeding comprehensive training content...");

    // 1. Insert Programming Course
    const courseRes = await client.query(`
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
      ON CONFLICT (slug) DO UPDATE SET title_ar = EXCLUDED.title_ar
      RETURNING id;
    `);
    const courseId = courseRes.rows[0].id;

    // 2. Insert Chapters
    const chapter1Res = await client.query(`
      INSERT INTO chapters (course_id, title_ar, title_en, "order")
      VALUES ($1, 'أساسيات البرمجة بلغة بايثون', 'Python Programming Basics', 1)
      RETURNING id;
    `, [courseId]);
    const ch1Id = chapter1Res.rows[0].id;

    const chapter2Res = await client.query(`
      INSERT INTO chapters (course_id, title_ar, title_en, "order")
      VALUES ($1, 'تطوير الواجهات الأمامية', 'Frontend Development', 2)
      RETURNING id;
    `, [courseId]);
    const ch2Id = chapter2Res.rows[0].id;

    // 3. Insert Lessons for Chapter 1 (Python)
    const lesson1Res = await client.query(`
      INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
      VALUES (
        $1,
        'مقدمة في بايثون والمغيرات',
        'Introduction to Python & Variables',
        'بايثون هي لغة برمجة قوية وسهلة التعلم. المتغيرات تستخدم لتخزين البيانات.',
        'Python is a powerful and easy-to-learn programming language. Variables are used to store data.',
        '# تعريف متغير\nname = "Manus"\nage = 25\nprint(f"Hello, my name is {name} and I am {age} years old.")',
        'python',
        100,
        1,
        true
      )
      RETURNING id;
    `, [ch1Id]);
    const l1Id = lesson1Res.rows[0].id;

    // 4. Insert Quiz for Lesson 1
    await client.query(`
      INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, xp_reward, "order")
      VALUES (
        $1,
        'كيف نقوم بطباعة نص في بايثون؟',
        'How do we print text in Python?',
        '[{"id": "0", "textAr": "print()", "textEn": "print()"}, {"id": "1", "textAr": "echo()", "textEn": "echo()"}, {"id": "2", "textAr": "console.log()", "textEn": "console.log()"}]',
        '0',
        50,
        1
      );
    `, [l1Id]);

    console.log("✅ Seeding complete!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
