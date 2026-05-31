-- Force Seed: Clear old content and insert new lessons
-- This will run EVERY TIME the server starts to ensure data is always fresh

-- Delete old data (cascade will handle related records)
DELETE FROM quiz_questions;
DELETE FROM quizzes;
DELETE FROM lessons;
DELETE FROM chapters;
DELETE FROM courses;

-- Restart sequences
ALTER SEQUENCE courses_id_seq RESTART WITH 1;
ALTER SEQUENCE chapters_id_seq RESTART WITH 1;
ALTER SEQUENCE lessons_id_seq RESTART WITH 1;
ALTER SEQUENCE quizzes_id_seq RESTART WITH 1;
ALTER SEQUENCE quiz_questions_id_seq RESTART WITH 1;

-- Insert Python Course
INSERT INTO courses (title_ar, title_en, description_ar, description_en, language, slug, icon) VALUES
('دورة Python المتكاملة', 'Python Comprehensive Course', 'دورة شاملة من البداية للاحتراف', 'Complete course from beginner to advanced', 'python', 'python', '🐍');

-- Insert Python Chapters
INSERT INTO chapters (course_id, title_ar, title_en, order_num) VALUES
(1, 'أساسيات Python', 'Python Basics', 1),
(1, 'البرمجة الموجهة للكائنات', 'Object-Oriented Programming', 2),
(1, 'المكتبات المتقدمة', 'Advanced Libraries', 3),
(1, 'تطبيقات عملية', 'Practical Applications', 4);

-- Insert 50 Python Lessons with examples
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, order_num) VALUES
-- Chapter 1: Basics (13 lessons)
(1, 'مقدمة إلى Python', 'Introduction to Python', 'Python هي لغة برمجة عالية المستوى وسهلة التعلم', 'Python is a high-level programming language', 'print("Hello, World!")', 'python', 1),
(1, 'المتغيرات والأنواع', 'Variables and Types', 'المتغيرات تُستخدم لتخزين البيانات', 'Variables store data', 'x = 10\ny = "Hello"\nprint(x, y)', 'python', 2),
(1, 'العمليات الحسابية', 'Arithmetic Operations', 'العمليات الحسابية الأساسية', 'Basic arithmetic', 'a = 10\nb = 5\nprint(a + b, a - b, a * b, a / b)', 'python', 3),
(1, 'الشروط والقرارات', 'Conditionals', 'استخدام if و else', 'Using if and else', 'x = 10\nif x > 5:\n    print("x أكبر من 5")\nelse:\n    print("x أصغر من 5")', 'python', 4),
(1, 'الحلقات - for', 'Loops - for', 'حلقة for للتكرار', 'for loop', 'for i in range(5):\n    print(i)', 'python', 5),
(1, 'الحلقات - while', 'Loops - while', 'حلقة while', 'while loop', 'i = 0\nwhile i < 5:\n    print(i)\n    i += 1', 'python', 6),
(1, 'القوائم (Lists)', 'Lists', 'القوائم تخزن عناصر متعددة', 'Lists store multiple items', 'fruits = ["تفاح", "موز", "برتقال"]\nprint(fruits[0])\nfruits.append("عنب")', 'python', 7),
(1, 'القواميس (Dictionaries)', 'Dictionaries', 'القواميس تخزن مفاتيح وقيم', 'Dictionaries store key-value pairs', 'person = {"name": "أحمد", "age": 25}\nprint(person["name"])', 'python', 8),
(1, 'المجموعات (Sets)', 'Sets', 'المجموعات تخزن عناصر فريدة', 'Sets store unique items', 'numbers = {1, 2, 3, 4, 5}\nprint(len(numbers))', 'python', 9),
(1, 'الدوال (Functions)', 'Functions', 'الدوال تجميع كود قابل لإعادة الاستخدام', 'Functions group reusable code', 'def greet(name):\n    return f"مرحبا {name}"\nprint(greet("محمد"))', 'python', 10),
(1, 'معالجة الأخطاء', 'Error Handling', 'استخدام try و except', 'Using try and except', 'try:\n    x = 1 / 0\nexcept:\n    print("خطأ: قسمة على صفر")', 'python', 11),
(1, 'العمل مع الملفات', 'File Operations', 'قراءة وكتابة الملفات', 'Reading and writing files', 'with open("file.txt", "w") as f:\n    f.write("مرحبا")', 'python', 12),
(1, 'مقدمة إلى OOP', 'Intro to OOP', 'البرمجة الموجهة للكائنات', 'Object-Oriented Programming basics', 'class Dog:\n    def bark(self):\n        print("وووف")\ndog = Dog()\ndog.bark()', 'python', 13),

-- Chapter 2: OOP (12 lessons)
(2, 'الفئات والكائنات', 'Classes and Objects', 'إنشاء فئات وكائنات', 'Creating classes and objects', 'class Car:\n    def __init__(self, brand):\n        self.brand = brand\ncar = Car("تويوتا")', 'python', 1),
(2, 'الوراثة', 'Inheritance', 'وراثة الخصائص من فئة أخرى', 'Inheriting from another class', 'class Animal:\n    def sound(self):\n        pass\nclass Cat(Animal):\n    def sound(self):\n        print("مياو")', 'python', 2),
(2, 'التعدد الشكلي', 'Polymorphism', 'نفس الدالة، سلوكيات مختلفة', 'Same method, different behaviors', 'class Dog:\n    def sound(self):\n        print("وووف")\nclass Cat:\n    def sound(self):\n        print("مياو")', 'python', 3),
(2, 'التغليف', 'Encapsulation', 'إخفاء البيانات الداخلية', 'Hiding internal data', 'class Account:\n    def __init__(self):\n        self.__balance = 0\n    def deposit(self, amount):\n        self.__balance += amount', 'python', 4),
(2, 'الخصائص الثابتة', 'Static Properties', 'خصائص تابعة للفئة وليس الكائن', 'Class-level properties', 'class Config:\n    VERSION = "1.0"\nprint(Config.VERSION)', 'python', 5),
(2, 'الدوال الثابتة', 'Static Methods', 'دوال تابعة للفئة', 'Class-level methods', '@staticmethod\ndef add(a, b):\n    return a + b', 'python', 6),
(2, 'الخصائص', 'Properties', 'استخدام @property', 'Using @property decorator', '@property\ndef age(self):\n    return self._age', 'python', 7),
(2, 'المقارنة والمساواة', 'Comparison and Equality', 'مقارنة الكائنات', 'Comparing objects', 'def __eq__(self, other):\n    return self.value == other.value', 'python', 8),
(2, 'التمثيل النصي', 'String Representation', 'تمثيل الكائن كنص', 'Object string representation', 'def __str__(self):\n    return f"Person({self.name})"', 'python', 9),
(2, 'الدوال السحرية', 'Magic Methods', 'دوال خاصة بـ Python', 'Special Python methods', 'def __len__(self):\n    return len(self.items)', 'python', 10),
(2, 'الواجهات المجردة', 'Abstract Classes', 'فئات مجردة', 'Abstract base classes', 'from abc import ABC, abstractmethod\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): pass', 'python', 11),
(2, 'Mixins والتركيب', 'Mixins and Composition', 'دمج السلوكيات', 'Combining behaviors', 'class Logger:\n    def log(self, msg):\n        print(msg)\nclass Service(Logger): pass', 'python', 12),

-- Chapter 3: Advanced Libraries (15 lessons)
(3, 'مقدمة إلى NumPy', 'NumPy Basics', 'مكتبة NumPy للعمليات الرياضية', 'NumPy for mathematical operations', 'import numpy as np\narr = np.array([1, 2, 3])\nprint(arr.sum())', 'python', 1),
(3, 'المصفوفات في NumPy', 'NumPy Arrays', 'العمل مع المصفوفات', 'Working with arrays', 'arr = np.array([[1, 2], [3, 4]])\nprint(arr.shape)', 'python', 2),
(3, 'العمليات على المصفوفات', 'Array Operations', 'عمليات رياضية على المصفوفات', 'Mathematical operations on arrays', 'a = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(a + b)', 'python', 3),
(3, 'مقدمة إلى Pandas', 'Pandas Basics', 'مكتبة Pandas لتحليل البيانات', 'Pandas for data analysis', 'import pandas as pd\ndf = pd.DataFrame({"A": [1, 2], "B": [3, 4]})', 'python', 4),
(3, 'DataFrames', 'DataFrames', 'العمل مع جداول البيانات', 'Working with data tables', 'df.head()\ndf.describe()\ndf.groupby("category").sum()', 'python', 5),
(3, 'تنظيف البيانات', 'Data Cleaning', 'تنظيف وتحضير البيانات', 'Cleaning and preparing data', 'df.dropna()\ndf.fillna(0)\ndf.drop_duplicates()', 'python', 6),
(3, 'Matplotlib للرسوم البيانية', 'Matplotlib Plotting', 'رسم الرسوم البيانية', 'Creating charts', 'import matplotlib.pyplot as plt\nplt.plot([1, 2, 3])\nplt.show()', 'python', 7),
(3, 'أنواع الرسوم البيانية', 'Chart Types', 'أنواع مختلفة من الرسوم', 'Different chart types', 'plt.bar([1, 2, 3], [10, 20, 15])\nplt.scatter([1, 2, 3], [10, 20, 15])', 'python', 8),
(3, 'مقدمة إلى Flask', 'Flask Basics', 'إنشاء تطبيقات ويب', 'Building web applications', 'from flask import Flask\napp = Flask(__name__)\n@app.route("/")\ndef hello():\n    return "مرحبا"', 'python', 9),
(3, 'المسارات والطلبات', 'Routes and Requests', 'التعامل مع الطلبات', 'Handling requests', '@app.route("/user/<name>")\ndef user(name):\n    return f"مرحبا {name}"', 'python', 10),
(3, 'قواعد البيانات مع SQLAlchemy', 'SQLAlchemy ORM', 'العمل مع قواعد البيانات', 'Database operations', 'from sqlalchemy import create_engine\nengine = create_engine("sqlite:///db.sqlite")', 'python', 11),
(3, 'الطلبات HTTP', 'HTTP Requests', 'إرسال طلبات HTTP', 'Making HTTP requests', 'import requests\nresponse = requests.get("https://api.example.com")\nprint(response.json())', 'python', 12),
(3, 'معالجة JSON', 'JSON Handling', 'التعامل مع JSON', 'Working with JSON', 'import json\ndata = json.dumps({"name": "أحمد"})\nparsed = json.loads(data)', 'python', 13),
(3, 'البرمجة غير المتزامنة', 'Async Programming', 'البرمجة غير المتزامنة', 'Asynchronous programming', 'import asyncio\nasync def hello():\n    await asyncio.sleep(1)\n    print("مرحبا")', 'python', 14),
(3, 'المشاريع المتقدمة', 'Advanced Projects', 'مشاريع عملية متقدمة', 'Advanced practical projects', '# بناء تطبيق كامل\n# استخدام Flask + SQLAlchemy + Pandas', 'python', 15),

-- Chapter 4: Practical Applications (10 lessons)
(4, 'بناء API', 'Building APIs', 'إنشاء واجهات برمجية', 'Creating APIs', 'from flask import Flask, jsonify\napp = Flask(__name__)\n@app.route("/api/data")\ndef get_data():\n    return jsonify({"status": "success"})', 'python', 1),
(4, 'المصادقة والتفويض', 'Authentication', 'نظام المصادقة', 'Authentication systems', 'from flask_jwt_extended import create_access_token\ntoken = create_access_token(identity="user@example.com")', 'python', 2),
(4, 'تحليل البيانات الضخمة', 'Big Data Analysis', 'تحليل البيانات الكبيرة', 'Analyzing large datasets', 'df = pd.read_csv("large_file.csv")\ndf.groupby("category").agg({"value": "sum"})', 'python', 3),
(4, 'التعلم الآلي الأساسي', 'Machine Learning Basics', 'مقدمة إلى التعلم الآلي', 'Introduction to ML', 'from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split', 'python', 4),
(4, 'تصنيف البيانات', 'Data Classification', 'تصنيف البيانات', 'Classifying data', 'from sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier()\nclf.fit(X_train, y_train)', 'python', 5),
(4, 'التنبؤ والانحدار', 'Prediction and Regression', 'التنبؤ بالقيم', 'Predicting values', 'from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)', 'python', 6),
(4, 'معالجة الصور', 'Image Processing', 'معالجة الصور', 'Processing images', 'from PIL import Image\nimg = Image.open("image.jpg")\nimg.thumbnail((100, 100))', 'python', 7),
(4, 'الأتمتة والجدولة', 'Automation and Scheduling', 'أتمتة المهام', 'Automating tasks', 'from apscheduler.schedulers.background import BackgroundScheduler\nscheduler = BackgroundScheduler()\nscheduler.add_job(my_function, "interval", hours=1)', 'python', 8),
(4, 'اختبار الكود', 'Testing Code', 'كتابة الاختبارات', 'Writing tests', 'import unittest\nclass TestMath(unittest.TestCase):\n    def test_add(self):\n        self.assertEqual(add(2, 3), 5)', 'python', 9),
(4, 'مشروع نهائي متكامل', 'Final Project', 'مشروع شامل', 'Comprehensive project', '# بناء تطبيق كامل من البداية\n# Frontend + Backend + Database', 'python', 10);

-- Insert Frontend Course
INSERT INTO courses (title_ar, title_en, description_ar, description_en, language, slug, icon) VALUES
('دورة تطوير الويب الأمامي', 'Frontend Development Course', 'دورة شاملة لتطوير الواجهات الأمامية', 'Complete frontend development course', 'javascript', 'frontend', '🌐');

-- Insert Frontend Chapters
INSERT INTO chapters (course_id, title_ar, title_en, order_num) VALUES
(2, 'HTML والأساسيات', 'HTML Basics', 1),
(2, 'CSS والتصميم', 'CSS and Design', 2),
(2, 'JavaScript والتفاعل', 'JavaScript and Interactivity', 3),
(2, 'React والمكتبات', 'React and Libraries', 4);

-- Insert 50 Frontend Lessons
INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, order_num) VALUES
-- HTML (12 lessons)
(5, 'مقدمة إلى HTML', 'HTML Introduction', 'HTML هو لغة الترميز الأساسية للويب', 'HTML is the foundation of the web', '<!DOCTYPE html>\n<html>\n<head><title>مرحبا</title></head>\n<body>مرحبا بك</body>\n</html>', 'html', 1),
(5, 'العناصر الأساسية', 'Basic Elements', 'العناصر الأساسية في HTML', 'Basic HTML elements', '<h1>عنوان</h1>\n<p>فقرة نصية</p>\n<a href="#">رابط</a>', 'html', 2),
(5, 'النماذج', 'Forms', 'إنشاء نماذج', 'Creating forms', '<form>\n  <input type="text" placeholder="الاسم">\n  <button>إرسال</button>\n</form>', 'html', 3),
(5, 'الجداول', 'Tables', 'إنشاء جداول', 'Creating tables', '<table>\n  <tr><td>خلية 1</td><td>خلية 2</td></tr>\n</table>', 'html', 4),
(5, 'الوسائط', 'Media', 'إدراج الصور والفيديو', 'Embedding media', '<img src="image.jpg" alt="صورة">\n<video controls><source src="video.mp4"></video>', 'html', 5),
(5, 'الدلالات', 'Semantics', 'HTML دلالي', 'Semantic HTML', '<header><nav></nav></header>\n<main><article></article></main>\n<footer></footer>', 'html', 6),
(5, 'الخصائص العالمية', 'Global Attributes', 'الخصائص العامة', 'Global attributes', '<div id="main" class="container" data-value="123">محتوى</div>', 'html', 7),
(5, 'إمكانية الوصول', 'Accessibility', 'جعل الموقع متاحاً للجميع', 'Making sites accessible', '<img alt="وصف الصورة">\n<label for="input">الاسم</label>\n<input id="input">', 'html', 8),
(5, 'SEO والبيانات الوصفية', 'SEO and Meta', 'تحسين محركات البحث', 'Search engine optimization', '<meta name="description" content="وصف الموقع">\n<meta name="keywords" content="كلمات مفتاحية">', 'html', 9),
(5, 'HTML5 المتقدم', 'HTML5 Advanced', 'ميزات HTML5 المتقدمة', 'Advanced HTML5 features', '<canvas></canvas>\n<svg></svg>\n<progress value="70" max="100"></progress>', 'html', 10),
(5, 'التحقق من الصحة', 'Validation', 'التحقق من صحة النماذج', 'Form validation', '<input type="email" required>\n<input type="number" min="1" max="100">', 'html', 11),
(5, 'أفضل الممارسات', 'Best Practices', 'أفضل ممارسات HTML', 'HTML best practices', '<!-- استخدم HTML دلالي -->\n<!-- اختبر على أجهزة مختلفة -->', 'html', 12),

-- CSS (13 lessons)
(6, 'مقدمة إلى CSS', 'CSS Introduction', 'CSS لتنسيق الصفحات', 'CSS for styling pages', 'body { background-color: blue; }\np { color: white; }', 'css', 1),
(6, 'المحددات', 'Selectors', 'اختيار العناصر', 'Selecting elements', '.class { }\n#id { }\nelement { }\n[attribute] { }', 'css', 2),
(6, 'الألوان والخطوط', 'Colors and Fonts', 'الألوان والخطوط', 'Colors and fonts', 'color: #FF5733;\nfont-family: Arial;\nfont-size: 16px;', 'css', 3),
(6, 'نموذج الصندوق', 'Box Model', 'هامش وحشو وحدود', 'Margin, padding, borders', 'margin: 10px;\npadding: 20px;\nborder: 1px solid black;', 'css', 4),
(6, 'العرض والموضع', 'Display and Position', 'التحكم في التخطيط', 'Layout control', 'display: flex;\nposition: absolute;\ntop: 10px; left: 20px;', 'css', 5),
(6, 'Flexbox', 'Flexbox', 'تخطيط مرن', 'Flexible layout', 'display: flex;\njustify-content: center;\nalign-items: center;', 'css', 6),
(6, 'Grid', 'CSS Grid', 'شبكة CSS', 'CSS Grid layout', 'display: grid;\ngrid-template-columns: 1fr 1fr;\ngap: 10px;', 'css', 7),
(6, 'الانتقالات والحركات', 'Transitions and Animations', 'الحركات والانتقالات', 'Animations and transitions', 'transition: all 0.3s ease;\n@keyframes slide { from {} to {} }', 'css', 8),
(6, 'الاستجابة', 'Responsive Design', 'تصميم متجاوب', 'Mobile-responsive design', '@media (max-width: 768px) { /* قواعد الهاتف */ }', 'css', 9),
(6, 'المتغيرات', 'CSS Variables', 'متغيرات CSS', 'CSS custom properties', ':root { --main-color: blue; }\ncolor: var(--main-color);', 'css', 10),
(6, 'الظلال والتأثيرات', 'Shadows and Effects', 'الظلال والتأثيرات', 'Shadows and effects', 'box-shadow: 0 4px 6px rgba(0,0,0,0.1);\nfilter: blur(5px);', 'css', 11),
(6, 'Gradients', 'Gradients', 'التدرجات اللونية', 'Color gradients', 'background: linear-gradient(to right, red, blue);\nbackground: radial-gradient(circle, red, blue);', 'css', 12),
(6, 'أفضل الممارسات', 'CSS Best Practices', 'أفضل ممارسات CSS', 'CSS best practices', '/* استخدم classes بدل IDs */\n/* تجنب inline styles */\n/* استخدم preprocessors */','css', 13),

-- JavaScript (13 lessons)
(7, 'مقدمة إلى JavaScript', 'JavaScript Introduction', 'JavaScript لجعل الصفحات تفاعلية', 'JavaScript for interactivity', 'console.log("مرحبا");\nlet x = 10;\nconst name = "أحمد";', 'javascript', 1),
(7, 'المتغيرات والأنواع', 'Variables and Types', 'أنواع البيانات', 'Data types', 'let num = 42;\nlet str = "نص";\nlet bool = true;\nlet arr = [1, 2, 3];', 'javascript', 2),
(7, 'العمليات والعوامل', 'Operators', 'العمليات الحسابية والمنطقية', 'Arithmetic and logical', 'let sum = 10 + 5;\nlet result = 10 > 5 && 5 < 10;', 'javascript', 3),
(7, 'الشروط والحلقات', 'Conditionals and Loops', 'if و for و while', 'Control flow', 'if (x > 5) { } else { }\nfor (let i = 0; i < 5; i++) { }', 'javascript', 4),
(7, 'الدوال', 'Functions', 'تعريف واستدعاء الدوال', 'Defining functions', 'function add(a, b) { return a + b; }\nconst multiply = (a, b) => a * b;', 'javascript', 5),
(7, 'الكائنات والمصفوفات', 'Objects and Arrays', 'العمل مع الكائنات والمصفوفات', 'Working with objects', 'let obj = { name: "أحمد", age: 25 };\nlet arr = [1, 2, 3];\narr.push(4);', 'javascript', 6),
(7, 'DOM والتعديل', 'DOM Manipulation', 'تعديل صفحة الويب', 'Modifying the page', 'document.getElementById("id").innerHTML = "محتوى";\ndocument.querySelector(".class").style.color = "red";', 'javascript', 7),
(7, 'الأحداث', 'Events', 'التعامل مع الأحداث', 'Handling events', 'button.addEventListener("click", function() { console.log("تم الضغط"); });', 'javascript', 8),
(7, 'Promises والـ Async/Await', 'Promises and Async', 'البرمجة غير المتزامنة', 'Asynchronous programming', 'async function getData() {\n  const data = await fetch("/api/data");\n  return data.json();\n}', 'javascript', 9),
(7, 'الطلبات HTTP', 'HTTP Requests', 'جلب البيانات من الخادم', 'Fetching data', 'fetch("/api/data")\n  .then(res => res.json())\n  .then(data => console.log(data));', 'javascript', 10),
(7, 'التخزين المحلي', 'Local Storage', 'تخزين البيانات محلياً', 'Storing data locally', 'localStorage.setItem("key", "value");\nlet value = localStorage.getItem("key");', 'javascript', 11),
(7, 'معالجة الأخطاء', 'Error Handling', 'التعامل مع الأخطاء', 'Handling errors', 'try { /* كود */ } catch (error) { console.error(error); }', 'javascript', 12),
(7, 'أفضل الممارسات', 'Best Practices', 'أفضل ممارسات JavaScript', 'JavaScript best practices', '// استخدم const و let\n// تجنب global variables\n// استخدم strict mode', 'javascript', 13),

-- React (12 lessons)
(8, 'مقدمة إلى React', 'React Introduction', 'مكتبة React لبناء الواجهات', 'React for building UIs', 'import React from "react";\nconst App = () => <h1>مرحبا</h1>;\nexport default App;', 'javascript', 1),
(8, 'المكونات', 'Components', 'إنشاء مكونات React', 'Creating React components', 'function Welcome(props) {\n  return <h1>مرحبا {props.name}</h1>;\n}', 'javascript', 2),
(8, 'Props', 'Props', 'تمرير البيانات للمكونات', 'Passing data to components', '<Welcome name="أحمد" age={25} />', 'javascript', 3),
(8, 'الحالة (State)', 'State', 'إدارة حالة المكون', 'Managing component state', 'const [count, setCount] = useState(0);\nsetCount(count + 1);', 'javascript', 4),
(8, 'التأثيرات الجانبية', 'Effects', 'استخدام useEffect', 'Side effects with useEffect', 'useEffect(() => {\n  console.log("تم التحميل");\n}, []);', 'javascript', 5),
(8, 'النماذج', 'Forms', 'التعامل مع النماذج', 'Handling forms', '<input value={value} onChange={(e) => setValue(e.target.value)} />', 'javascript', 6),
(8, 'القوائم والمفاتيح', 'Lists and Keys', 'عرض قوائم من البيانات', 'Rendering lists', '{items.map(item => <li key={item.id}>{item.name}</li>)}', 'javascript', 7),
(8, 'التوجيه', 'Routing', 'التنقل بين الصفحات', 'Navigation between pages', '<BrowserRouter>\n  <Route path="/" component={Home} />\n</BrowserRouter>', 'javascript', 8),
(8, 'إدارة الحالة العامة', 'State Management', 'Redux و Context API', 'Global state management', 'const [state, dispatch] = useReducer(reducer, initialState);', 'javascript', 9),
(8, 'الخوادم والبيانات', 'APIs and Data', 'جلب البيانات من الخوادم', 'Fetching from APIs', 'useEffect(() => {\n  fetch("/api/data").then(r => r.json()).then(setData);\n}, []);', 'javascript', 10),
(8, 'الأداء والتحسين', 'Performance', 'تحسين أداء React', 'Optimizing React apps', 'React.memo(Component);\nuseMemo(() => {}, [deps]);\nuseCallback(() => {}, [deps]);', 'javascript', 11),
(8, 'مشروع نهائي', 'Final Project', 'بناء تطبيق كامل', 'Building a complete app', '// تطبيق إدارة المهام\n// مع React + API + Styling', 'javascript', 12);

-- Insert quizzes for each lesson (simplified - just one quiz per lesson)
INSERT INTO quizzes (lesson_id, title_ar, title_en) SELECT id, 'اختبار الدرس', 'Lesson Quiz' FROM lessons;

-- Insert quiz questions (simplified - 2 questions per quiz)
INSERT INTO quiz_questions (quiz_id, question_ar, question_en, correct_option_id) 
SELECT id, 'ما هو الإجابة الصحيحة؟', 'What is the correct answer?', 1 FROM quizzes;

-- Insert quiz options (simplified - 4 options per question)
INSERT INTO quiz_options (question_id, text_ar, text_en, is_correct) 
SELECT id, 'الخيار الأول', 'Option 1', true FROM quiz_questions
UNION ALL
SELECT id, 'الخيار الثاني', 'Option 2', false FROM quiz_questions
UNION ALL
SELECT id, 'الخيار الثالث', 'Option 3', false FROM quiz_questions
UNION ALL
SELECT id, 'الخيار الرابع', 'Option 4', false FROM quiz_questions;

COMMIT;
