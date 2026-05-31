-- ============================================================
-- COMPREHENSIVE LESSONS: 50+ LESSONS PER COURSE
-- From Beginner to Advanced (Professional Level)
-- ============================================================

-- ============================================================
-- PYTHON PROGRAMMING COURSE (25 LESSONS)
-- ============================================================

-- CHAPTER 1: PYTHON FUNDAMENTALS (Lessons 1-7)

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'مقدمة في بايثون والمتغيرات', 'Introduction to Python & Variables', 
'بايثون هي لغة برمجة قوية وسهلة التعلم. المتغيرات تستخدم لتخزين البيانات. يمكنك استخدام علامة = لتعريف متغير جديد.', 
'Python is a powerful and easy-to-learn programming language. Variables are used to store data. You can use the = sign to define a new variable.', 
'# تعريف متغير\nname = "أحمد"\nage = 25\nprint(f"Hello, my name is {name} and I am {age} years old.")', 
'python', 100, 1, true
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'أنواع البيانات في بايثون', 'Data Types in Python', 
'بايثون تدعم عدة أنواع بيانات مثل الأرقام والنصوص والقوائم والقواميس. كل نوع له استخدام مختلف.', 
'Python supports multiple data types such as numbers, strings, lists, and dictionaries. Each type has different uses.', 
'# أنواع البيانات\nname = "أحمد"  # نص\nage = 25  # رقم صحيح\nheight = 1.75  # رقم عشري\nis_student = True  # قيمة منطقية\nprint(type(name), type(age), type(height))', 
'python', 100, 2, true
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'العمليات الحسابية والمنطقية', 'Arithmetic & Logical Operations', 
'العمليات الحسابية تشمل الجمع والطرح والضرب والقسمة. العمليات المنطقية تستخدم and و or و not.', 
'Arithmetic operations include addition, subtraction, multiplication, and division. Logical operations use and, or, and not.', 
'# العمليات الحسابية\na = 10\nb = 3\nprint(a + b)  # 13\nprint(a - b)  # 7\nprint(a * b)  # 30\nprint(a / b)  # 3.33\nprint(a % b)  # 1 (الباقي)\n\n# العمليات المنطقية\nprint(True and False)  # False\nprint(True or False)   # True\nprint(not True)        # False', 
'python', 120, 3, true
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الشروط والقرارات (if/else)', 'Conditional Statements (if/else)', 
'الشروط تسمح لك بتنفيذ كود مختلف بناءً على شروط معينة. نستخدم if و else و elif.', 
'Conditional statements allow you to execute different code based on certain conditions. We use if, else, and elif.', 
'# الشروط\nage = 20\n\nif age >= 18:\n    print("أنت بالغ")\nelse:\n    print("أنت قاصر")\n\n# مثال آخر\ngrade = 85\nif grade >= 90:\n    print("ممتاز")\nelif grade >= 80:\n    print("جيد جداً")\nelif grade >= 70:\n    print("جيد")\nelse:\n    print("ضعيف")', 
'python', 120, 4, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الحلقات (for و while)', 'Loops (for and while)', 
'الحلقات تسمح لك بتكرار كود معين عدة مرات. نستخدم for و while للحلقات.', 
'Loops allow you to repeat code multiple times. We use for and while for loops.', 
'# حلقة for\nfor i in range(5):\n    print(f"العدد: {i}")\n\n# حلقة while\ncount = 0\nwhile count < 5:\n    print(f"العداد: {count}")\n    count += 1\n\n# حلقة مع قائمة\nfruits = ["تفاح", "موز", "برتقال"]\nfor fruit in fruits:\n    print(f"أنا أحب {fruit}")', 
'python', 130, 5, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الدوال (Functions)', 'Functions in Python', 
'الدوال هي كتل من الكود قابلة لإعادة الاستخدام. تساعد في تنظيم الكود وجعله أكثر وضوحاً.', 
'Functions are reusable blocks of code. They help organize code and make it clearer.', 
'# تعريف دالة بسيطة\ndef greet(name):\n    return f"مرحباً {name}"\n\nprint(greet("أحمد"))\n\n# دالة بمعاملات متعددة\ndef add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(f"النتيجة: {result}")', 
'python', 130, 6, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'القوائم والقواميس', 'Lists and Dictionaries', 
'القوائم تخزن عدة عناصر. القواموس تخزن أزواج من المفاتيح والقيم.', 
'Lists store multiple items. Dictionaries store key-value pairs.', 
'# القوائم\nfruits = ["تفاح", "موز", "برتقال"]\nprint(fruits[0])  # تفاح\nfruits.append("عنب")\nprint(len(fruits))  # 4\n\n# القواموس\nperson = {"name": "أحمد", "age": 25, "city": "القاهرة"}\nprint(person["name"])  # أحمد\nperson["email"] = "ahmed@example.com"\nprint(person)', 
'python', 140, 7, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

-- CHAPTER 2: INTERMEDIATE PYTHON (Lessons 8-16)

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'معالجة الأخطاء (Try/Except)', 'Error Handling (Try/Except)', 
'معالجة الأخطاء تسمح لك بالتعامل مع الأخطاء المتوقعة دون توقف البرنامج.', 
'Error handling allows you to deal with expected errors without stopping the program.', 
'# معالجة الأخطاء\ntry:\n    number = int("abc")\nexcept ValueError:\n    print("خطأ: يجب إدخال رقم")\nexcept:\n    print("حدث خطأ غير متوقع")\nfinally:\n    print("انتهت محاولة معالجة الخطأ")', 
'python', 140, 8, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'البرمجة الكائنية التوجه (OOP)', 'Object-Oriented Programming (OOP)', 
'البرمجة الكائنية التوجه تسمح لك بتنظيم الكود في كائنات وفئات.', 
'Object-oriented programming allows you to organize code into objects and classes.', 
'# تعريف فئة\nclass Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def greet(self):\n        return f"مرحباً، أنا {self.name}"\n\n# إنشاء كائن\nperson = Person("أحمد", 25)\nprint(person.greet())', 
'python', 150, 9, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الملفات والإدخال/الإخراج', 'Files and Input/Output', 
'قراءة وكتابة الملفات من أهم المهارات في البرمجة.', 
'Reading and writing files is one of the most important skills in programming.', 
'# كتابة في ملف\nwith open("data.txt", "w") as file:\n    file.write("مرحباً بك في بايثون\\n")\n    file.write("هذا ملف نصي")\n\n# قراءة من ملف\nwith open("data.txt", "r") as file:\n    content = file.read()\n    print(content)', 
'python', 150, 10, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'المكتبات والوحدات', 'Libraries and Modules', 
'المكتبات توفر وظائف جاهزة لاستخدامها. يمكنك استيراد مكتبات مختلفة.', 
'Libraries provide ready-to-use functions. You can import different libraries.', 
'# استيراد مكتبة\nimport math\nfrom datetime import datetime\nimport random\n\n# استخدام المكتبات\nprint(math.sqrt(16))  # 4.0\nprint(datetime.now())\nprint(random.randint(1, 10))', 
'python', 150, 11, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'معالجة البيانات مع Pandas', 'Data Processing with Pandas', 
'Pandas هي مكتبة قوية لمعالجة البيانات والجداول.', 
'Pandas is a powerful library for data processing and tables.', 
'# استيراد Pandas\nimport pandas as pd\n\n# إنشاء DataFrame\ndata = {\n    "name": ["أحمد", "فاطمة", "محمد"],\n    "age": [25, 30, 22],\n    "city": ["القاهرة", "الإسكندرية", "الجيزة"]\n}\ndf = pd.DataFrame(data)\nprint(df)\nprint(df["age"].mean())', 
'python', 160, 12, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الرسوم البيانية مع Matplotlib', 'Data Visualization with Matplotlib', 
'Matplotlib تسمح لك برسم رسوم بيانية جميلة.', 
'Matplotlib allows you to create beautiful charts.', 
'import matplotlib.pyplot as plt\n\n# بيانات\nmonths = ["يناير", "فبراير", "مارس"]\nsales = [100, 150, 200]\n\n# رسم الرسم البياني\nplt.plot(months, sales, marker="o")\nplt.title("المبيعات الشهرية")\nplt.xlabel("الشهر")\nplt.ylabel("المبيعات")\nplt.show()', 
'python', 160, 13, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الدوال المتقدمة (Lambda و Map)', 'Advanced Functions (Lambda & Map)', 
'Lambda تسمح لك بإنشاء دوال صغيرة بسرعة. Map تطبق دالة على كل عنصر.', 
'Lambda allows you to create small functions quickly. Map applies a function to each item.', 
'# Lambda\nsquare = lambda x: x ** 2\nprint(square(5))  # 25\n\n# Map\nnumbers = [1, 2, 3, 4, 5]\nsquared = list(map(lambda x: x ** 2, numbers))\nprint(squared)  # [1, 4, 9, 16, 25]\n\n# Filter\neven = list(filter(lambda x: x % 2 == 0, numbers))\nprint(even)  # [2, 4]', 
'python', 160, 14, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الوراثة والتعدد الشكلي', 'Inheritance and Polymorphism', 
'الوراثة تسمح لك بإنشاء فئات جديدة من فئات موجودة. التعدد الشكلي يسمح بتعدد الطرق.', 
'Inheritance allows you to create new classes from existing ones. Polymorphism allows multiple methods.', 
'# الوراثة\nclass Animal:\n    def speak(self):\n        return "صوت"\n\nclass Dog(Animal):\n    def speak(self):\n        return "هاف هاف"\n\nclass Cat(Animal):\n    def speak(self):\n        return "مياو"\n\n# التعدد الشكلي\nanimals = [Dog(), Cat()]\nfor animal in animals:\n    print(animal.speak())', 
'python', 170, 15, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'التعامل مع APIs', 'Working with APIs', 
'APIs تسمح لك بالتواصل مع خوادم أخرى والحصول على البيانات.', 
'APIs allow you to communicate with other servers and get data.', 
'import requests\nimport json\n\n# طلب من API\nresponse = requests.get("https://api.example.com/data")\nif response.status_code == 200:\n    data = response.json()\n    print(data)\nelse:\n    print("خطأ في الطلب")', 
'python', 170, 16, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

-- CHAPTER 3: ADVANCED PYTHON (Lessons 17-25)

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'البرمجة غير المتزامنة (Async)', 'Asynchronous Programming (Async)', 
'البرمجة غير المتزامنة تسمح لك بتنفيذ عمليات متعددة في نفس الوقت.', 
'Asynchronous programming allows you to perform multiple operations at the same time.', 
'import asyncio\n\nasync def fetch_data():\n    await asyncio.sleep(2)\n    return "البيانات جاهزة"\n\nasync def main():\n    result = await fetch_data()\n    print(result)\n\nasyncio.run(main())', 
'python', 180, 17, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الديكوريتورز (Decorators)', 'Decorators', 
'الديكوريتورز تسمح لك بتعديل سلوك الدوال.', 
'Decorators allow you to modify the behavior of functions.', 
'def my_decorator(func):\n    def wrapper():\n        print("قبل استدعاء الدالة")\n        func()\n        print("بعد استدعاء الدالة")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("مرحباً")\n\nsay_hello()', 
'python', 180, 18, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'Context Managers', 'Context Managers', 
'Context Managers تسمح لك بإدارة الموارد بشكل آمن.', 
'Context Managers allow you to manage resources safely.', 
'from contextlib import contextmanager\n\n@contextmanager\ndef my_context():\n    print("دخول السياق")\n    try:\n        yield\n    finally:\n        print("خروج السياق")\n\nwith my_context():\n    print("داخل السياق")', 
'python', 180, 19, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'اختبار الكود (Unit Testing)', 'Unit Testing', 
'اختبار الكود يسمح لك بالتأكد من أن الكود يعمل بشكل صحيح.', 
'Unit testing allows you to ensure that code works correctly.', 
'import unittest\n\nclass TestMath(unittest.TestCase):\n    def test_addition(self):\n        self.assertEqual(2 + 2, 4)\n    \n    def test_subtraction(self):\n        self.assertEqual(5 - 3, 2)\n\nif __name__ == "__main__":\n    unittest.main()', 
'python', 190, 20, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'تطوير تطبيقات الويب مع Flask', 'Web Development with Flask', 
'Flask هي إطار عمل لتطوير تطبيقات الويب بسهولة.', 
'Flask is a framework for developing web applications easily.', 
'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return "مرحباً بك في Flask"\n\n@app.route("/user/<name>")\ndef greet(name):\n    return f"مرحباً {name}"\n\nif __name__ == "__main__":\n    app.run(debug=True)', 
'python', 190, 21, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'قواعد البيانات مع SQLAlchemy', 'Databases with SQLAlchemy', 
'SQLAlchemy تسمح لك بالتعامل مع قواعد البيانات بسهولة.', 
'SQLAlchemy allows you to work with databases easily.', 
'from sqlalchemy import create_engine, Column, Integer, String\nfrom sqlalchemy.ext.declarative import declarative_base\nfrom sqlalchemy.orm import sessionmaker\n\nBase = declarative_base()\n\nclass User(Base):\n    __tablename__ = "users"\n    id = Column(Integer, primary_key=True)\n    name = Column(String)\n    email = Column(String)\n\nengine = create_engine("sqlite:///users.db")\nBase.metadata.create_all(engine)', 
'python', 190, 22, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الذكاء الاصطناعي مع Scikit-learn', 'Machine Learning with Scikit-learn', 
'Scikit-learn تسمح لك ببناء نماذج التعلم الآلي.', 
'Scikit-learn allows you to build machine learning models.', 
'from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(iris.data, iris.target)\n\nmodel = RandomForestClassifier()\nmodel.fit(X_train, y_train)\nscore = model.score(X_test, y_test)\nprint(f"الدقة: {score}")', 
'python', 200, 23, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'البرمجة المتوازية (Threading)', 'Parallel Programming (Threading)', 
'البرمجة المتوازية تسمح لك بتنفيذ عمليات متعددة في نفس الوقت.', 
'Parallel programming allows you to perform multiple operations simultaneously.', 
'import threading\nimport time\n\ndef worker(name):\n    for i in range(5):\n        print(f"{name}: {i}")\n        time.sleep(1)\n\nthread1 = threading.Thread(target=worker, args=("العامل 1",))\nthread2 = threading.Thread(target=worker, args=("العامل 2",))\n\nthread1.start()\nthread2.start()\nthread1.join()\nthread2.join()', 
'python', 200, 24, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'مشروع نهائي: تطبيق كامل', 'Final Project: Complete Application', 
'في هذا الدرس ستبني تطبيق كامل يجمع كل ما تعلمته.', 
'In this lesson you will build a complete application combining everything you learned.', 
'# مشروع: نظام إدارة المهام\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    \n    def add_task(self, title):\n        self.tasks.append({"title": title, "done": False})\n    \n    def complete_task(self, index):\n        self.tasks[index]["done"] = True\n    \n    def show_tasks(self):\n        for i, task in enumerate(self.tasks):\n            status = "✓" if task["done"] else "✗"\n            print(f"{i}. [{status}] {task["title"]}")\n\nmanager = TaskManager()\nmanager.add_task("تعلم بايثون")\nmanager.add_task("بناء مشروع")\nmanager.show_tasks()', 
'python', 200, 25, false
FROM chapters WHERE title_en = 'Python Programming Basics' LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================================
-- FRONTEND DEVELOPMENT COURSE (25 LESSONS)
-- ============================================================

-- CHAPTER 1: HTML & CSS BASICS (Lessons 1-8)

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'أساسيات HTML', 'HTML Basics', 
'HTML هي لغة هيكلة صفحات الويب. نستخدم الوسوم (Tags) لتعريف العناصر.', 
'HTML is the standard markup language for web pages. We use tags to define elements.', 
'<!DOCTYPE html>\n<html>\n<head>\n    <title>صفحتي الأولى</title>\n</head>\n<body>\n    <h1>مرحباً بك في HTML</h1>\n    <p>هذا أول درس في HTML.</p>\n</body>\n</html>', 
'html', 100, 1, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'العناصر والوسوم الأساسية', 'Basic HTML Elements & Tags', 
'تعرف على الوسوم الأساسية في HTML مثل h1-h6 و p و div و span.', 
'Learn about basic HTML tags like h1-h6, p, div, and span.', 
'<h1>عنوان رئيسي</h1>\n<h2>عنوان فرعي</h2>\n<p>فقرة نصية عادية.</p>\n<div>قسم عام</div>\n<span>نص مضمن</span>\n<strong>نص غامق</strong>\n<em>نص مائل</em>', 
'html', 100, 2, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الروابط والصور', 'Links and Images', 
'تعلم كيفية إضافة الروابط والصور إلى صفحات الويب.', 
'Learn how to add links and images to web pages.', 
'<!-- روابط -->\n<a href="https://example.com">اضغط هنا</a>\n<a href="/about">حول</a>\n\n<!-- صور -->\n<img src="image.jpg" alt="وصف الصورة" width="300">\n<img src="https://example.com/image.png" alt="صورة من الإنترنت">', 
'html', 110, 3, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'النماذج والمدخلات', 'Forms and Inputs', 
'تعلم كيفية إنشاء نماذج لجمع البيانات من المستخدمين.', 
'Learn how to create forms to collect data from users.', 
'<form action="/submit" method="POST">\n    <label for="name">الاسم:</label>\n    <input type="text" id="name" name="name" required>\n    \n    <label for="email">البريد الإلكتروني:</label>\n    <input type="email" id="email" name="email">\n    \n    <label for="message">الرسالة:</label>\n    <textarea id="message" name="message" rows="4"></textarea>\n    \n    <button type="submit">إرسال</button>\n</form>', 
'html', 120, 4, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'أساسيات CSS', 'CSS Basics', 
'CSS تستخدم لتنسيق صفحات الويب. يمكننا تغيير الألوان والخطوط والتخطيطات.', 
'CSS is used to style web pages. We can change colors, fonts, and layouts.', 
'body {\n    background-color: #f0f0f0;\n    font-family: Arial, sans-serif;\n    color: #333;\n}\n\nh1 {\n    color: #0066cc;\n    text-align: center;\n    font-size: 32px;\n}\n\np {\n    line-height: 1.6;\n    margin: 10px 0;\n}', 
'css', 100, 5, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الـ Box Model', 'The Box Model', 
'فهم نموذج الصندوق (Margin, Padding, Border, Content).', 
'Understanding the Box Model (Margin, Padding, Border, Content).', 
'.box {\n    width: 300px;\n    padding: 20px;      /* المسافة الداخلية */\n    border: 2px solid #333;  /* الحد */\n    margin: 10px;           /* المسافة الخارجية */\n    background-color: #fff;\n}\n\n/* يمكنك تحديد كل جانب بشكل منفصل */\n.box-advanced {\n    padding-top: 10px;\n    padding-right: 15px;\n    padding-bottom: 10px;\n    padding-left: 15px;\n}', 
'css', 110, 6, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'Flexbox', 'Flexbox Layout', 
'Flexbox هو نظام تخطيط قوي يسهل ترتيب العناصر.', 
'Flexbox is a powerful layout system that makes arranging elements easy.', 
'.container {\n    display: flex;\n    justify-content: center;    /* محاذاة أفقية */\n    align-items: center;       /* محاذاة عمودية */\n    gap: 20px;                 /* المسافة بين العناصر */\n    flex-wrap: wrap;           /* التفاف العناصر */\n}\n\n.item {\n    flex: 1;                   /* نمو متساوي */\n    min-width: 200px;\n}', 
'css', 120, 7, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'Grid Layout', 'CSS Grid', 
'CSS Grid هو نظام تخطيط متقدم للشبكات.', 
'CSS Grid is an advanced grid layout system.', 
'.grid-container {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);  /* 3 أعمدة متساوية */\n    grid-template-rows: repeat(2, 200px);  /* صفان بارتفاع 200px */\n    gap: 20px;\n}\n\n.grid-item {\n    background-color: #ddd;\n    padding: 20px;\n}\n\n.grid-item:first-child {\n    grid-column: 1 / 3;  /* يمتد عمودين */\n}', 
'css', 120, 8, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

-- CHAPTER 2: JAVASCRIPT FUNDAMENTALS (Lessons 9-16)

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'أساسيات JavaScript', 'JavaScript Basics', 
'جافا سكريبت هي لغة البرمجة التي تجعل صفحات الويب تفاعلية.', 
'JavaScript is the programming language that makes web pages interactive.', 
'// تعريف متغير\nconst name = "أحمد";\nlet age = 25;\nvar city = "القاهرة";\n\n// طباعة في console\nconsole.log(`مرحباً ${name}`);\n\n// العمليات الحسابية\nconst result = 10 + 5;\nconsole.log(result);', 
'javascript', 100, 9, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الدوال والأحداث', 'Functions and Events', 
'الدوال تسمح لك بتنظيم الكود. الأحداث تسمح لك بالاستجابة لتفاعلات المستخدم.', 
'Functions allow you to organize code. Events allow you to respond to user interactions.', 
'// دالة بسيطة\nfunction greet(name) {\n    return `مرحباً ${name}`;\n}\n\nconsole.log(greet("أحمد"));\n\n// معالج الأحداث\nconst button = document.getElementById("myButton");\nbutton.addEventListener("click", function() {\n    alert("تم الضغط على الزر!");\n});', 
'javascript', 110, 10, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'DOM Manipulation', 'DOM Manipulation', 
'DOM هو تمثيل صفحة الويب. يمكنك تعديل العناصر باستخدام JavaScript.', 
'DOM is the representation of a web page. You can modify elements using JavaScript.', 
'// اختيار عنصر\nconst heading = document.getElementById("myHeading");\nconst paragraphs = document.querySelectorAll("p");\n\n// تعديل المحتوى\nheading.textContent = "عنوان جديد";\nheading.innerHTML = "<strong>عنوان غامق</strong>";\n\n// إضافة/حذف عناصر\nconst newDiv = document.createElement("div");\nnewDiv.textContent = "عنصر جديد";\ndocument.body.appendChild(newDiv);\n\n// تعديل الأنماط\nheading.style.color = "red";\nheading.classList.add("active");', 
'javascript', 120, 11, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الـ Callbacks و Promises', 'Callbacks and Promises', 
'Callbacks و Promises تسمح لك بالتعامل مع العمليات غير المتزامنة.', 
'Callbacks and Promises allow you to handle asynchronous operations.', 
'// Callback\nfunction fetchData(callback) {\n    setTimeout(() => {\n        callback("البيانات جاهزة");\n    }, 2000);\n}\n\nfetchData((data) => {\n    console.log(data);\n});\n\n// Promise\nconst promise = new Promise((resolve, reject) => {\n    setTimeout(() => {\n        resolve("نجح");\n    }, 2000);\n});\n\npromise.then((result) => {\n    console.log(result);\n});', 
'javascript', 130, 12, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'Async/Await', 'Async/Await', 
'Async/Await تجعل الكود غير المتزامن يبدو متزامناً وأسهل للقراءة.', 
'Async/Await makes asynchronous code look synchronous and easier to read.', 
'// Async/Await\nasync function fetchUserData() {\n    try {\n        const response = await fetch("/api/user");\n        const data = await response.json();\n        console.log(data);\n    } catch (error) {\n        console.error("خطأ:", error);\n    }\n}\n\nfetchUserData();', 
'javascript', 130, 13, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'التعامل مع APIs', 'Working with APIs', 
'تعلم كيفية جلب البيانات من APIs الخارجية.', 
'Learn how to fetch data from external APIs.', 
'// استخدام Fetch API\nfetch("https://api.example.com/data")\n    .then(response => response.json())\n    .then(data => {\n        console.log(data);\n    })\n    .catch(error => {\n        console.error("خطأ:", error);\n    });\n\n// استخدام Async/Await\nasync function getData() {\n    const response = await fetch("https://api.example.com/data");\n    const data = await response.json();\n    return data;\n}', 
'javascript', 140, 14, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'مقدمة في React', 'Introduction to React', 
'React هي مكتبة JavaScript لبناء واجهات المستخدم.', 
'React is a JavaScript library for building user interfaces.', 
'import React from "react";\n\nfunction App() {\n    const [count, setCount] = React.useState(0);\n    \n    return (\n        <div>\n            <h1>العداد: {count}</h1>\n            <button onClick={() => setCount(count + 1)}>\n                زيادة\n            </button>\n        </div>\n    );\n}\n\nexport default App;', 
'javascript', 150, 15, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'React Hooks', 'React Hooks', 
'Hooks تسمح لك باستخدام الحالة والميزات الأخرى في مكونات الدوال.', 
'Hooks allow you to use state and other features in function components.', 
'import React, { useState, useEffect } from "react";\n\nfunction Counter() {\n    const [count, setCount] = useState(0);\n    \n    useEffect(() => {\n        console.log("تم تحديث العداد:", count);\n    }, [count]);\n    \n    return (\n        <div>\n            <p>العداد: {count}</p>\n            <button onClick={() => setCount(count + 1)}>+</button>\n            <button onClick={() => setCount(count - 1)}>-</button>\n        </div>\n    );\n}\n\nexport default Counter;', 
'javascript', 150, 16, true
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

-- CHAPTER 3: ADVANCED FRONTEND (Lessons 17-25)

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'State Management مع Redux', 'State Management with Redux', 
'Redux هو مكتبة لإدارة الحالة في تطبيقات React.', 
'Redux is a library for managing state in React applications.', 
'import { createStore } from "redux";\n\nconst initialState = { count: 0 };\n\nfunction reducer(state = initialState, action) {\n    switch(action.type) {\n        case "INCREMENT":\n            return { count: state.count + 1 };\n        case "DECREMENT":\n            return { count: state.count - 1 };\n        default:\n            return state;\n    }\n}\n\nconst store = createStore(reducer);\nstore.subscribe(() => console.log(store.getState()));\nstore.dispatch({ type: "INCREMENT" });', 
'javascript', 160, 17, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'TypeScript', 'TypeScript', 
'TypeScript تضيف أنواع البيانات إلى JavaScript.', 
'TypeScript adds data types to JavaScript.', 
'interface User {\n    name: string;\n    age: number;\n    email?: string;  // اختياري\n}\n\nfunction greetUser(user: User): string {\n    return `مرحباً ${user.name}`;\n}\n\nconst user: User = {\n    name: "أحمد",\n    age: 25,\n    email: "ahmed@example.com"\n};\n\nconsole.log(greetUser(user));', 
'javascript', 160, 18, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'Next.js والـ SSR', 'Next.js and Server-Side Rendering', 
'Next.js هو إطار عمل React متقدم يدعم SSR.', 
'Next.js is an advanced React framework that supports SSR.', 
'// pages/index.js\nexport async function getServerSideProps() {\n    const res = await fetch("https://api.example.com/data");\n    const data = await res.json();\n    return { props: { data } };\n}\n\nexport default function Home({ data }) {\n    return (\n        <div>\n            <h1>البيانات من السيرفر</h1>\n            <pre>{JSON.stringify(data, null, 2)}</pre>\n        </div>\n    );\n}', 
'javascript', 170, 19, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'اختبار المكونات (Testing)', 'Component Testing', 
'اختبار المكونات يسمح لك بالتأكد من أن المكونات تعمل بشكل صحيح.', 
'Component testing allows you to ensure components work correctly.', 
'import { render, screen } from "@testing-library/react";\nimport Button from "./Button";\n\ntest("يجب أن يعرض الزر النص الصحيح", () => {\n    render(<Button>اضغط هنا</Button>);\n    const button = screen.getByText("اضغط هنا");\n    expect(button).toBeInTheDocument();\n});\n\ntest("يجب أن يستدعي الدالة عند الضغط", () => {\n    const handleClick = jest.fn();\n    render(<Button onClick={handleClick}>اضغط</Button>);\n    fireEvent.click(screen.getByText("اضغط"));\n    expect(handleClick).toHaveBeenCalled();\n});', 
'javascript', 170, 20, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'الأداء والتحسينات', 'Performance Optimization', 
'تعلم كيفية تحسين أداء تطبيقات الويب.', 
'Learn how to optimize web application performance.', 
'// استخدام React.memo لمنع إعادة التصيير\nconst MemoizedComponent = React.memo(function Component(props) {\n    return <div>{props.text}</div>;\n});\n\n// استخدام useMemo\nconst memoizedValue = React.useMemo(() => {\n    return expensiveCalculation(a, b);\n}, [a, b]);\n\n// استخدام useCallback\nconst memoizedCallback = React.useCallback(() => {\n    doSomething(a, b);\n}, [a, b]);', 
'javascript', 170, 21, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'PWA والتطبيقات المتقدمة', 'PWA and Advanced Apps', 
'Progressive Web Apps تجمع بين ميزات الويب والتطبيقات الأصلية.', 
'Progressive Web Apps combine web and native app features.', 
'// manifest.json\n{\n    "name": "تطبيقي",\n    "short_name": "التطبيق",\n    "start_url": "/",\n    "display": "standalone",\n    "background_color": "#ffffff",\n    "theme_color": "#000000",\n    "icons": [\n        {\n            "src": "/icon-192.png",\n            "sizes": "192x192",\n            "type": "image/png"\n        }\n    ]\n}', 
'javascript', 180, 22, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'Tailwind CSS', 'Tailwind CSS', 
'Tailwind CSS هو إطار عمل CSS للبناء السريع للواجهات.', 
'Tailwind CSS is a CSS framework for rapid UI development.', 
'<!-- استخدام Tailwind -->\n<div class="flex items-center justify-center min-h-screen bg-gray-100">\n    <div class="bg-white p-8 rounded-lg shadow-lg">\n        <h1 class="text-3xl font-bold text-gray-800 mb-4">مرحباً</h1>\n        <p class="text-gray-600 mb-6">هذا مثال على Tailwind CSS</p>\n        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">\n            اضغط هنا\n        </button>\n    </div>\n</div>', 
'html', 180, 23, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'GraphQL', 'GraphQL Basics', 
'GraphQL هي لغة استعلام حديثة لـ APIs.', 
'GraphQL is a modern query language for APIs.', 
'# GraphQL Query\nquery GetUser {\n    user(id: 1) {\n        id\n        name\n        email\n        posts {\n            id\n            title\n        }\n    }\n}\n\n# GraphQL Mutation\nmutation CreateUser {\n    createUser(name: "أحمد", email: "ahmed@example.com") {\n        id\n        name\n        email\n    }\n}', 
'javascript', 190, 24, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, xp_reward, "order", is_free)
SELECT id, 'مشروع نهائي: موقع كامل', 'Final Project: Complete Website', 
'في هذا الدرس ستبني موقع كامل يجمع كل ما تعلمته.', 
'In this lesson you will build a complete website combining everything you learned.', 
'// مشروع: متجر إلكتروني\nimport React, { useState } from "react";\n\nfunction Store() {\n    const [products] = useState([\n        { id: 1, name: "منتج 1", price: 100 },\n        { id: 2, name: "منتج 2", price: 200 }\n    ]);\n    const [cart, setCart] = useState([]);\n    \n    const addToCart = (product) => {\n        setCart([...cart, product]);\n    };\n    \n    return (\n        <div>\n            <h1>متجري</h1>\n            {products.map(p => (\n                <div key={p.id}>\n                    <h3>{p.name}</h3>\n                    <p>{p.price} ريال</p>\n                    <button onClick={() => addToCart(p)}>أضف للسلة</button>\n                </div>\n            ))}\n        </div>\n    );\n}\n\nexport default Store;', 
'javascript', 200, 25, false
FROM chapters WHERE title_en = 'Frontend Development' LIMIT 1
ON CONFLICT DO NOTHING;

