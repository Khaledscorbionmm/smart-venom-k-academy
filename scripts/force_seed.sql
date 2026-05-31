-- Smart Venom K Academy - Comprehensive Fixed Seed
  -- Fixes: removed nonexistent quizzes table refs, order_num -> "order", added all 15 languages

  DELETE FROM quiz_questions;
  DELETE FROM user_progress;
  DELETE FROM lessons;
  DELETE FROM chapters;
  DELETE FROM courses;

  ALTER SEQUENCE courses_id_seq RESTART WITH 1;
  ALTER SEQUENCE chapters_id_seq RESTART WITH 1;
  ALTER SEQUENCE lessons_id_seq RESTART WITH 1;
  ALTER SEQUENCE quiz_questions_id_seq RESTART WITH 1;

  INSERT INTO courses (title_ar, title_en, description_ar, description_en, language, slug, icon, color, category, sort_order, is_free_trial_available, is_active) VALUES
  ('دورة Python', 'Python Course', 'تعلم Python من الصفر حتى الاحتراف', 'Learn Python from beginner to pro', 'python', 'python', '🐍', '#3776AB', 'programming', 1, true, true),
  ('دورة JavaScript', 'JavaScript Course', 'تعلم JavaScript وبناء مواقع تفاعلية', 'Learn JS and build interactive sites', 'javascript', 'javascript', '🟨', '#F7DF1E', 'programming', 2, true, true),
  ('دورة TypeScript', 'TypeScript Course', 'JavaScript مع أنواع بيانات قوية', 'JavaScript with strong typing', 'typescript', 'typescript', '🔷', '#3178C6', 'programming', 3, true, true),
  ('دورة C++', 'C++ Course', 'برمجة النظم والأداء العالي', 'Systems programming and high performance', 'cpp', 'cpp', '⚙️', '#00599C', 'programming', 4, true, true),
  ('دورة Java', 'Java Course', 'تعلم Java ومبادئ OOP', 'Learn Java and OOP principles', 'java', 'java', '☕', '#ED8B00', 'programming', 5, true, true),
  ('دورة Go', 'Go Course', 'لغة Go للأنظمة الحديثة', 'Go for modern systems and cloud', 'go', 'go', '🐹', '#00ADD8', 'programming', 6, true, true),
  ('دورة Rust', 'Rust Course', 'برمجة آمنة وسريعة مع Rust', 'Safe and fast programming with Rust', 'rust', 'rust', '🦀', '#CE422B', 'programming', 7, true, true),
  ('دورة C#', 'C# Course', 'تطوير .NET مع C#', '.NET development with C#', 'csharp', 'csharp', '💠', '#239120', 'programming', 8, true, true),
  ('دورة PHP', 'PHP Course', 'تطوير الويب من جهة الخادم', 'Server-side web development', 'php', 'php', '🐘', '#777BB4', 'programming', 9, true, true),
  ('دورة SQL', 'SQL Course', 'قواعد البيانات والاستعلامات', 'Databases and queries', 'sql', 'sql', '🗄️', '#4479A1', 'programming', 10, true, true),
  ('دورة HTML', 'HTML Course', 'بناء صفحات الويب', 'Building web pages', 'html', 'html', '🌐', '#E34F26', 'programming', 11, true, true),
  ('دورة CSS', 'CSS Course', 'تصميم وتنسيق صفحات الويب', 'Styling web pages', 'css', 'css', '🎨', '#264DE4', 'programming', 12, true, true),
  ('دورة Kotlin', 'Kotlin Course', 'تطوير Android مع Kotlin', 'Android dev with Kotlin', 'kotlin', 'kotlin', '🎯', '#7F52FF', 'programming', 13, true, true),
  ('دورة Swift', 'Swift Course', 'تطوير iOS مع Swift', 'iOS dev with Swift', 'swift', 'swift', '🍎', '#FF6B35', 'programming', 14, true, true),
  ('دورة Dart', 'Dart Course', 'تطوير Flutter مع Dart', 'Flutter dev with Dart', 'dart', 'dart', '🎪', '#0175C2', 'programming', 15, true, true);
  

  -- PYTHON CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (1, 'أساسيات Python', 'Python Basics', 1),
  (1, 'البرمجة كائنية التوجه', 'Object-Oriented Programming', 2),
  (1, 'المكتبات والتطبيقات', 'Libraries and Applications', 3);

  -- JAVASCRIPT CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (2, 'أساسيات JavaScript', 'JavaScript Basics', 1),
  (2, 'البرمجة المتقدمة', 'Advanced Programming', 2),
  (2, 'DOM والمتصفح', 'DOM and Browser', 3);

  -- TYPESCRIPT CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (3, 'أساسيات TypeScript', 'TypeScript Basics', 1),
  (3, 'الأنواع المتقدمة', 'Advanced Types', 2);

  -- C++ CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (4, 'أساسيات C++', 'C++ Basics', 1),
  (4, 'OOP في C++', 'OOP in C++', 2);

  -- JAVA CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (5, 'أساسيات Java', 'Java Basics', 1),
  (5, 'OOP في Java', 'OOP in Java', 2);

  -- GO CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (6, 'أساسيات Go', 'Go Basics', 1);

  -- RUST CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (7, 'أساسيات Rust', 'Rust Basics', 1);

  -- C# CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (8, 'أساسيات C#', 'C# Basics', 1);

  -- PHP CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (9, 'أساسيات PHP', 'PHP Basics', 1);

  -- SQL CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (10, 'أساسيات SQL', 'SQL Basics', 1),
  (10, 'الاستعلامات المتقدمة', 'Advanced Queries', 2);

  -- HTML CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (11, 'أساسيات HTML', 'HTML Basics', 1),
  (11, 'HTML المتقدم', 'Advanced HTML', 2);

  -- CSS CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (12, 'أساسيات CSS', 'CSS Basics', 1),
  (12, 'CSS المتقدم', 'Advanced CSS', 2);

  -- KOTLIN CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (13, 'أساسيات Kotlin', 'Kotlin Basics', 1);

  -- SWIFT CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (14, 'أساسيات Swift', 'Swift Basics', 1);

  -- DART CHAPTERS
  INSERT INTO chapters (course_id, title_ar, title_en, "order") VALUES
  (15, 'أساسيات Dart', 'Dart Basics', 1);
  

  -- PYTHON LESSONS (chapter_id 1=basics, 2=OOP, 3=Libraries)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (1,'مقدمة إلى Python','Introduction to Python',
  'Python لغة برمجة سهلة وقوية أُنشئت عام 1991 على يد Guido van Rossum. تُستخدم في الذكاء الاصطناعي وتطوير الويب وتحليل البيانات.',
  'Python is an easy and powerful language created in 1991 by Guido van Rossum, used in AI, web development, and data analysis.',
  'print("Hello, World!")
print("مرحباً بالعالم!")
print(2 + 2)
print(type(42))',
  'python',1,50,true),

  (1,'المتغيرات وأنواع البيانات','Variables and Data Types',
  'المتغيرات تُستخدم لتخزين البيانات. Python تحدد النوع تلقائياً.',
  'Variables store data. Python determines types automatically.',
  'name = "أحمد"
age = 25
height = 1.75
is_student = True
print(name, age, height, is_student)
print(type(name))
print(type(age))',
  'python',2,50,true),

  (1,'العمليات الحسابية','Arithmetic Operations',
  'Python تدعم جميع العمليات الحسابية الأساسية والمتقدمة.',
  'Python supports all basic and advanced arithmetic operations.',
  'a, b = 10, 3
print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a // b)
print(a % b)
print(a ** b)',
  'python',3,50,true),

  (1,'الشروط if/else','Conditionals if/else',
  'الشروط تتيح اتخاذ قرارات في الكود بناءً على القيم.',
  'Conditionals allow making decisions in code based on values.',
  'temperature = 35
if temperature > 30:
    print("الجو حار")
elif temperature > 20:
    print("الجو معتدل")
else:
    print("الجو بارد")',
  'python',4,50,true),

  (1,'حلقة for','For Loop',
  'حلقة for تُستخدم للتكرار على عناصر قائمة أو نطاق.',
  'For loop iterates over items in a list or range.',
  'for i in range(5):
    print(f"العدد: {i}")

fruits = ["تفاح", "موز", "برتقال"]
for fruit in fruits:
    print(f"الفاكهة: {fruit}")',
  'python',5,50,true),

  (1,'حلقة while','While Loop',
  'حلقة while تكرر الكود طالما الشرط صحيح.',
  'While loop repeats code as long as condition is true.',
  'count = 0
while count < 5:
    print(f"العداد: {count}")
    count += 1',
  'python',6,50,true),

  (1,'القوائم Lists','Lists',
  'القوائم تخزن عناصر متعددة بترتيب وتسمح بالتعديل.',
  'Lists store multiple items in order and allow modification.',
  'numbers = [1, 2, 3, 4, 5]
numbers.append(6)
numbers.insert(0, 0)
print(numbers)
print(numbers[0])
print(numbers[-1])
print(numbers[1:3])',
  'python',7,50,false),

  (1,'القواميس Dictionaries','Dictionaries',
  'القواميس تخزن البيانات كأزواج مفتاح-قيمة.',
  'Dictionaries store data as key-value pairs.',
  'student = {"name": "محمد", "age": 20, "grade": "A"}
print(student["name"])
student["email"] = "m@example.com"
for key, value in student.items():
    print(f"{key}: {value}")',
  'python',8,50,false),

  (1,'الدوال Functions','Functions',
  'الدوال تتيح إعادة استخدام الكود وتنظيمه.',
  'Functions allow code reuse and organization.',
  'def greet(name, greeting="مرحبا"):
    return f"{greeting} {name}!"

print(greet("أحمد"))
print(greet("Sara", "Hello"))

def add_all(*numbers):
    return sum(numbers)
print(add_all(1, 2, 3, 4, 5))',
  'python',9,50,false),

  (1,'معالجة الأخطاء','Error Handling',
  'معالجة الأخطاء تجعل برنامجك أكثر موثوقية.',
  'Error handling makes your program more reliable.',
  'try:
    result = 100 / 0
except ZeroDivisionError:
    print("خطأ: لا يمكن القسمة على صفر")
except ValueError as e:
    print(f"خطأ في القيمة: {e}")
finally:
    print("تم تنفيذ الكود")',
  'python',10,60,false),

  (2,'مقدمة إلى OOP','Intro to OOP',
  'البرمجة الكائنية تنظم الكود في كائنات تحتوي على بيانات وسلوكيات.',
  'OOP organizes code into objects containing data and behaviors.',
  'class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
    def bark(self):
        return f"{self.name} يقول: هاو هاو!"
    def __str__(self):
        return f"كلب: {self.name} ({self.breed})"

dog = Dog("ريكس", "جيرمن شيبرد")
print(dog)
print(dog.bark())',
  'python',1,70,false),

  (2,'الوراثة Inheritance','Inheritance',
  'الوراثة تتيح إنشاء فئات جديدة تبني على فئات موجودة.',
  'Inheritance allows creating new classes that build on existing ones.',
  'class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."
class Cat(Animal):
    def speak(self):
        return f"{self.name}: مياو!"
class Dog(Animal):
    def speak(self):
        return f"{self.name}: هاو هاو!"
animals = [Cat("كيتي"), Dog("ريكس")]
for a in animals:
    print(a.speak())',
  'python',2,70,false),

  (2,'التغليف Encapsulation','Encapsulation',
  'التغليف يُخفي التفاصيل الداخلية للكلاس.',
  'Encapsulation hides internal class details.',
  'class BankAccount:
    def __init__(self, balance=0):
        self.__balance = balance
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return amount
        return 0
    def get_balance(self):
        return self.__balance
acc = BankAccount(1000)
acc.deposit(500)
print(acc.get_balance())',
  'python',3,70,false),

  (3,'العمل مع الملفات','File Operations',
  'Python تتيح قراءة وكتابة الملفات بسهولة.',
  'Python allows reading and writing files easily.',
  'with open("data.txt", "w", encoding="utf-8") as f:
    f.write("مرحبا بالعالم\n")
    f.write("السطر الثاني\n")
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)
with open("data.txt", "r") as f:
    for line in f:
        print(line.strip())',
  'python',1,80,false),

  (3,'Lambda والبرمجة الوظيفية','Lambda and Functional Programming',
  'Python تدعم البرمجة الوظيفية مع lambda و map و filter.',
  'Python supports functional programming with lambda, map, filter.',
  'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
from functools import reduce
total = reduce(lambda x, y: x + y, numbers)
print(squares)
print(evens)
print(total)',
  'python',2,80,false);
  

  -- JAVASCRIPT LESSONS (chapter_ids 4=basics, 5=advanced, 6=DOM)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (4,'مقدمة إلى JavaScript','Introduction to JavaScript',
  'JavaScript لغة البرمجة الأساسية للويب. تعمل في المتصفح وعلى الخادم (Node.js).',
  'JavaScript is the primary web programming language, running in browsers and servers (Node.js).',
  'console.log("Hello, World!");
console.log("مرحبا بالعالم!");
let x = 5, y = 3;
console.log(x + y);
console.log(x * y);
console.log(typeof "hello");',
  'javascript',1,50,true),

  (4,'المتغيرات let و const','Variables let and const',
  'في JS الحديثة نستخدم let للمتغيرات و const للثوابت بدلاً من var.',
  'In modern JS we use let for variables and const for constants instead of var.',
  'const PI = 3.14159;
let radius = 5;
let area = PI * radius ** 2;
console.log("المساحة:", area.toFixed(2));

let name = "أحمد";
name = "محمد";
console.log(name);',
  'javascript',2,50,true),

  (4,'الدوال Functions','Functions',
  'الدوال كتل قابلة لإعادة الاستخدام. JS تدعم عدة أنواع من الدوال.',
  'Functions are reusable blocks. JS supports several function types.',
  'function greet(name) {
  return "مرحبا " + name + "!";
}

const multiply = (a, b) => a * b;

const say = (msg = "مرحبا") => console.log(msg);

console.log(greet("أحمد"));
console.log(multiply(4, 5));
say();
say("Hello!");',
  'javascript',3,50,true),

  (4,'المصفوفات Arrays','Arrays',
  'المصفوفات تخزن قوائم من القيم مع طرق قوية للمعالجة.',
  'Arrays store lists of values with powerful processing methods.',
  'const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(doubled);
console.log(evens);
console.log(sum);',
  'javascript',4,50,true),

  (4,'الكائنات Objects','Objects',
  'الكائنات تمثل بيانات منظمة كأزواج مفتاح-قيمة.',
  'Objects represent structured data as key-value pairs.',
  'const person = {
  name: "سارة",
  age: 28,
  greet() { return "مرحبا، أنا " + this.name; }
};
console.log(person.name);
console.log(person.greet());
const { name, age } = person;
console.log(name, age);
const clone = { ...person, city: "الرياض" };
console.log(clone);',
  'javascript',5,50,true),

  (4,'الوعود Promises','Promises',
  'البرمجة غير المتزامنة مع Promises وasync/await.',
  'Asynchronous programming with Promises and async/await.',
  'const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log("البداية...");
  await wait(100);
  console.log("بعد الانتظار!");
  
  try {
    const data = await fetch("https://api.github.com/zen");
    const text = await data.text();
    console.log("GitHub says:", text);
  } catch (e) {
    console.log("تعذر الاتصال");
  }
}
main();',
  'javascript',6,70,false),

  (5,'الكلاسات Classes','Classes',
  'الكلاسات توفر صياغة نظيفة للبرمجة كائنية التوجه.',
  'Classes provide clean OOP syntax in JavaScript.',
  'class Shape {
  constructor(color) { this.color = color; }
  describe() { return "شكل " + this.color; }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
  describe() { return super.describe() + " دائرة r=" + this.radius; }
}

const c = new Circle("أحمر", 5);
console.log(c.describe());
console.log(c.area().toFixed(2));',
  'javascript',1,70,false),

  (5,'Destructuring والSpread','Destructuring and Spread',
  'أدوات قوية في JS الحديثة لتفكيك البيانات.',
  'Powerful modern JS tools for deconstructing data.',
  'const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a, b, rest);

const { x, y, ...others } = { x: 1, y: 2, z: 3, w: 4 };
console.log(x, y, others);

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined);',
  'javascript',2,60,false),

  (6,'التعامل مع DOM','DOM Manipulation',
  'DOM تتيح التفاعل مع عناصر صفحة الويب.',
  'DOM allows interacting with web page elements.',
  'const div = document.createElement("div");
div.textContent = "مرحبا!";
div.style.color = "blue";
div.style.padding = "10px";
document.body.appendChild(div);

div.addEventListener("click", () => {
  div.style.backgroundColor = "yellow";
  div.textContent = "تم الضغط!";
});

console.log("عدد العناصر:", document.querySelectorAll("*").length);',
  'javascript',1,80,false);

  -- TYPESCRIPT LESSONS (chapter_ids 7=basics, 8=advanced)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (7,'مقدمة إلى TypeScript','Introduction to TypeScript',
  'TypeScript هو JavaScript مع أنواع بيانات ثابتة. يجعل الكود أكثر أماناً.',
  'TypeScript is JavaScript with static types, making code safer.',
  'let name: string = "أحمد";
let age: number = 25;
let isActive: boolean = true;
let score: number | null = null;
console.log(name, age, isActive, score);',
  'typescript',1,50,true),

  (7,'الواجهات Interfaces','Interfaces',
  'الواجهات تحدد شكل البيانات في TypeScript.',
  'Interfaces define the shape of data in TypeScript.',
  'interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

function createUser(data: User): string {
  return "المستخدم: " + data.name + " (" + data.email + ")";
}

const user: User = { id: 1, name: "أحمد", email: "ahmed@example.com" };
console.log(createUser(user));',
  'typescript',2,60,true),

  (7,'Generics','Generics',
  'الـ Generics تتيح كتابة كود قابل لإعادة الاستخدام مع أنواع مختلفة.',
  'Generics allow writing reusable code with different types.',
  'function identity<T>(arg: T): T { return arg; }

function getFirst<T>(arr: T[]): T | undefined { return arr[0]; }

console.log(identity<string>("مرحبا"));
console.log(identity<number>(42));
console.log(getFirst([1, 2, 3]));
console.log(getFirst(["a", "b", "c"]));',
  'typescript',3,70,false),

  (8,'Union Types','Union Types',
  'أنواع متحدة تسمح للمتغير بقبول أنواع متعددة.',
  'Union types allow a variable to accept multiple types.',
  'type ID = string | number;
type Status = "active" | "inactive" | "pending";

let userId: ID = 42;
userId = "abc123";

let status: Status = "active";
console.log(userId, status);',
  'typescript',1,70,false),

  (8,'Type Assertions والUtility Types','Type Assertions and Utility Types',
  'أدوات TypeScript المدمجة للتعامل مع الأنواع.',
  'TypeScript built-in tools for working with types.',
  'interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type PartialTodo = Partial<Todo>;
type ReadonlyTodo = Readonly<Todo>;
type TodoTitle = Pick<Todo, "title">;

const todo: PartialTodo = { title: "تعلم TypeScript" };
console.log(todo);',
  'typescript',2,80,false);

  -- C++ LESSONS (chapter_ids 9=basics, 10=OOP)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (9,'مقدمة إلى C++','Introduction to C++',
  'C++ لغة برمجة قوية عالية الأداء تُستخدم في الأنظمة والألعاب.',
  'C++ is a powerful high-performance language used in systems and games.',
  '#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "العالم";
    cout << "مرحباً " << name << "!" << endl;
    int a = 10, b = 3;
    cout << a + b << endl;
    cout << (double)a / b << endl;
    return 0;
}',
  'cpp',1,60,true),

  (9,'المتغيرات والأنواع','Variables and Types',
  'C++ لغة ذات أنواع ثابتة - يجب تحديد نوع المتغير.',
  'C++ is statically typed - you must specify variable types.',
  '#include <iostream>
#include <string>
using namespace std;
int main() {
    int age = 25;
    double pi = 3.14159;
    char grade = ''A'';
    bool isValid = true;
    string name = "أحمد";
    cout << name << " " << age << " " << pi << endl;
    return 0;
}',
  'cpp',2,60,true),

  (9,'الدوال','Functions',
  'دوال C++ تحتاج تحديد أنواع المعاملات.',
  'C++ functions require specifying parameter types.',
  '#include <iostream>
using namespace std;

int add(int a, int b) { return a + b; }

double average(double x, double y) { return (x + y) / 2.0; }

void greet(string name = "صديقي") {
    cout << "مرحباً " << name << "!" << endl;
}

int main() {
    cout << add(5, 3) << endl;
    cout << average(4.5, 7.5) << endl;
    greet("أحمد");
    greet();
    return 0;
}',
  'cpp',3,60,true),

  (9,'الحلقات','Loops',
  'حلقات C++ مشابهة لأغلب اللغات.',
  'C++ loops are similar to most languages.',
  '#include <iostream>
using namespace std;
int main() {
    for (int i = 1; i <= 5; i++)
        cout << i << " ";
    cout << endl;
    int n = 10;
    while (n > 0) {
        cout << n << " ";
        n -= 2;
    }
    cout << endl;
    int arr[] = {1, 2, 3, 4, 5};
    for (int x : arr)
        cout << x * x << " ";
    return 0;
}',
  'cpp',4,60,false),

  (10,'الكلاسات في C++','Classes in C++',
  'الكلاسات هي أساس OOP في C++.',
  'Classes are the foundation of OOP in C++.',
  '#include <iostream>
#include <string>
using namespace std;
class Animal {
private:
    string name;
    int age;
public:
    Animal(string n, int a) : name(n), age(a) {}
    void speak() const { cout << name << " يتكلم!" << endl; }
    string getName() const { return name; }
};
int main() {
    Animal dog("ريكس", 3);
    dog.speak();
    cout << dog.getName() << endl;
    return 0;
}',
  'cpp',1,80,false);

  -- JAVA LESSONS (chapter_ids 11=basics, 12=OOP)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (11,'مقدمة إلى Java','Introduction to Java',
  'Java لغة موجهة للكائنات تعمل على أي منصة عبر JVM.',
  'Java is an OOP language that runs on any platform via JVM.',
  'public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("مرحباً بالعالم!");
        int a = 10, b = 5;
        System.out.println("الجمع: " + (a + b));
        System.out.println("الضرب: " + (a * b));
    }
}',
  'java',1,60,true),

  (11,'المتغيرات والأنواع','Variables and Types',
  'Java لغة ذات أنواع ثابتة صارمة.',
  'Java is strictly statically typed.',
  'public class Types {
    public static void main(String[] args) {
        int age = 25;
        double salary = 5000.50;
        char grade = ''A'';
        boolean active = true;
        String name = "أحمد";
        System.out.println(name + " " + age + " " + salary);
        System.out.println(name.getClass().getName());
    }
}',
  'java',2,60,true),

  (11,'الشروط والحلقات','Conditionals and Loops',
  'الشروط والحلقات في Java مشابهة لـ C++ وJS.',
  'Java conditionals and loops are similar to C++ and JS.',
  'public class Control {
    public static void main(String[] args) {
        int score = 85;
        String grade;
        if (score >= 90) grade = "ممتاز";
        else if (score >= 75) grade = "جيد جداً";
        else if (score >= 60) grade = "جيد";
        else grade = "راسب";
        System.out.println(grade);
        for (int i = 1; i <= 5; i++)
            System.out.print(i + " ");
    }
}',
  'java',3,60,true),

  (12,'الكلاسات والكائنات','Classes and Objects',
  'الكلاسات قلب Java النابض.',
  'Classes are the beating heart of Java.',
  'public class Car {
    private String brand;
    private int year;
    
    public Car(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    public String getBrand() { return brand; }
    
    @Override
    public String toString() {
        return brand + " " + year;
    }
    
    public static void main(String[] args) {
        Car car = new Car("تويوتا", 2024);
        System.out.println(car);
    }
}',
  'java',1,80,false);
  

  -- GO LESSONS (chapter_id 13)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (13,'مقدمة إلى Go','Introduction to Go',
  'Go لغة مفتوحة المصدر من Google، سريعة وبسيطة للأنظمة الموزعة.',
  'Go is an open-source language from Google, fast and simple for distributed systems.',
  'package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    name := "Ahmed"
    age := 25
    fmt.Printf("Name: %s, Age: %d\n", name, age)
    a, b := 10, 3
    fmt.Println(a+b, a-b, a*b)
}',
  'go',1,60,true),

  (13,'الدوال والعودة المتعددة','Functions and Multiple Returns',
  'Go تدعم إرجاع قيم متعددة من الدوال.',
  'Go supports returning multiple values from functions.',
  'package main

import ("errors";"fmt")

func divide(a, b float64) (float64, error) {
    if b == 0 { return 0, errors.New("division by zero") }
    return a / b, nil
}

func minMax(arr []int) (int, int) {
    min, max := arr[0], arr[0]
    for _, v := range arr {
        if v < min { min = v }
        if v > max { max = v }
    }
    return min, max
}

func main() {
    result, err := divide(10, 3)
    if err != nil { fmt.Println("Error:", err) } else { fmt.Printf("%.2f\n", result) }
    min, max := minMax([]int{3, 1, 4, 1, 5, 9})
    fmt.Println(min, max)
}',
  'go',2,70,true),

  (13,'Goroutines والتزامن','Goroutines and Concurrency',
  'Goroutines هي وحدات تزامن خفيفة في Go.',
  'Goroutines are lightweight concurrency units in Go.',
  'package main

import ("fmt";"sync")

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()
    fmt.Printf("Worker %d done\n", id)
}

func main() {
    var wg sync.WaitGroup
    for i := 1; i <= 5; i++ {
        wg.Add(1)
        go worker(i, &wg)
    }
    wg.Wait()
    fmt.Println("All workers done!")
}',
  'go',3,80,false);

  -- RUST LESSONS (chapter_id 14)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (14,'مقدمة إلى Rust','Introduction to Rust',
  'Rust لغة أنظمة آمنة وسريعة بدون Garbage Collector.',
  'Rust is a safe, fast systems language without a Garbage Collector.',
  'fn main() {
    println!("Hello, World!");
    let x = 5;
    let y = 10;
    println!("Sum: {}", x + y);
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("{} {}", s1, s2);
}',
  'rust',1,70,true),

  (14,'الملكية Ownership','Ownership',
  'نظام الملكية في Rust يضمن أمان الذاكرة بدون GC.',
  'Rust ownership system guarantees memory safety without GC.',
  'fn length(s: &String) -> usize { s.len() }

fn main() {
    let x = 5;
    let y = x;
    println!("{} {}", x, y);
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("{} {}", s1, s2);
    let s3 = String::from("world");
    let len = length(&s3);
    println!("{} has length {}", s3, len);
}',
  'rust',2,80,true),

  (14,'Structs و Enums','Structs and Enums',
  'Structs و Enums أدوات تمثيل البيانات في Rust.',
  'Structs and Enums are data representation tools in Rust.',
  '#[derive(Debug)]
struct Point { x: f64, y: f64 }

#[derive(Debug)]
enum Direction { North, South, East, West }

impl Point {
    fn distance(&self, other: &Point) -> f64 {
        ((self.x-other.x).powi(2) + (self.y-other.y).powi(2)).sqrt()
    }
}

fn main() {
    let p1 = Point { x: 0.0, y: 0.0 };
    let p2 = Point { x: 3.0, y: 4.0 };
    println!("Distance: {}", p1.distance(&p2));
    println!("{:?}", Direction::North);
}',
  'rust',3,80,false);

  -- C# LESSONS (chapter_id 15)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (15,'مقدمة إلى C#','Introduction to C#',
  'C# لغة من Microsoft تعمل على .NET.',
  'C# is a Microsoft language running on .NET.',
  'using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        int a = 10, b = 5;
        Console.WriteLine("Sum: " + (a + b));
        string name = "Ahmed";
        Console.WriteLine("Hello " + name);
    }
}',
  'csharp',1,60,true),

  (15,'الكلاسات والخصائص','Classes and Properties',
  'C# تدعم خصائص Properties لإدارة الوصول للبيانات.',
  'C# supports Properties for managing data access.',
  'using System;
class Person {
    public string Name { get; set; }
    public int Age { get; set; }
    public Person(string name, int age) { Name = name; Age = age; }
    public void Introduce() { Console.WriteLine("I am " + Name + ", age " + Age); }
    static void Main() {
        var p = new Person("Ahmed", 25);
        p.Introduce();
        p.Age = 26;
        Console.WriteLine("New age: " + p.Age);
    }
}',
  'csharp',2,70,true),

  (15,'LINQ','LINQ',
  'LINQ يتيح استعلامات قوية على المجموعات في C#.',
  'LINQ enables powerful queries on collections in C#.',
  'using System;
using System.Linq;
using System.Collections.Generic;
class Program {
    static void Main() {
        var nums = new List<int> {1,2,3,4,5,6,7,8,9,10};
        var evens = nums.Where(n => n % 2 == 0).ToList();
        var squares = nums.Select(n => n * n).ToList();
        Console.WriteLine(string.Join(", ", evens));
        Console.WriteLine(string.Join(", ", squares));
        Console.WriteLine("Sum: " + nums.Sum());
    }
}',
  'csharp',3,80,false);

  -- PHP LESSONS (chapter_id 16)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (16,'مقدمة إلى PHP','Introduction to PHP',
  'PHP لغة مخصصة لتطوير الويب من جانب الخادم.',
  'PHP is dedicated to server-side web development.',
  '<?php
$name = "World";
echo "Hello " . $name . "!\n";
$a = 10; $b = 5;
echo "Sum: " . ($a + $b) . "\n";
$pi = 3.14159;
$area = $pi * 5 ** 2;
echo "Area: " . round($area, 2) . "\n";
echo "Type: " . gettype($name) . "\n";
?>',
  'php',1,50,true),

  (16,'المصفوفات والدوال','Arrays and Functions',
  'PHP تدعم مصفوفات قوية ودوال مرنة.',
  'PHP supports powerful arrays and flexible functions.',
  '<?php
$fruits = ["Apple", "Banana", "Orange"];
foreach ($fruits as $i => $fruit) {
    echo ($i + 1) . ". " . $fruit . "\n";
}
function greet($name = "Friend") {
    return "Hello $name!";
}
echo greet("Ahmed") . "\n";
$person = ["name" => "Sara", "age" => 28];
echo $person["name"] . " - " . $person["age"] . "\n";
$nums = array_map(fn($n) => $n * 2, [1, 2, 3, 4, 5]);
echo implode(", ", $nums) . "\n";
?>',
  'php',2,60,true),

  (16,'الكلاسات في PHP','Classes in PHP',
  'PHP تدعم البرمجة الكائنية الكاملة.',
  'PHP fully supports object-oriented programming.',
  '<?php
class Animal {
    private string $name;
    public function __construct(string $name) { $this->name = $name; }
    public function speak(): string { return $this->name . " speaks!"; }
    public function getName(): string { return $this->name; }
}
class Dog extends Animal {
    public function speak(): string { return $this->getName() . ": Woof!"; }
}
$dog = new Dog("Rex");
echo $dog->speak() . "\n";
?>',
  'php',3,70,false);

  -- SQL LESSONS (chapter_ids 17=basics, 18=advanced)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (17,'مقدمة إلى SQL','Introduction to SQL',
  'SQL لغة الاستعلام الهيكلية لإدارة قواعد البيانات العلائقية.',
  'SQL is the Structured Query Language for managing relational databases.',
  'CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    grade CHAR(1)
);

INSERT INTO students (name, age, grade) VALUES
    (''Ahmed'', 20, ''A''),
    (''Sara'', 22, ''B''),
    (''Mohamed'', 21, ''A'');

SELECT * FROM students;
SELECT name FROM students WHERE grade = ''A'';',
  'sql',1,60,true),

  (17,'SELECT والفلترة','SELECT and Filtering',
  'استعلامات SELECT أساس التعامل مع قواعد البيانات.',
  'SELECT queries are the foundation of database interaction.',
  'SELECT * FROM products;
SELECT name, price FROM products WHERE price > 100;
SELECT * FROM products
WHERE category = ''books'' AND price < 50;
SELECT * FROM products
WHERE name LIKE ''%Python%'';
SELECT * FROM products
ORDER BY price DESC LIMIT 10;',
  'sql',2,60,true),

  (17,'INSERT UPDATE DELETE','Data Modification',
  'عمليات تعديل البيانات الأساسية في SQL.',
  'Basic data modification operations in SQL.',
  'INSERT INTO students (name, age, grade)
VALUES (''Khalid'', 23, ''B'');

UPDATE students
SET grade = ''A''
WHERE name = ''Khalid'';

DELETE FROM students
WHERE grade = ''C'';

SELECT * FROM students ORDER BY name;',
  'sql',3,70,false),

  (18,'JOIN بين الجداول','JOIN Between Tables',
  'JOIN يربط جداول متعددة في استعلام واحد.',
  'JOIN links multiple tables in a single query.',
  'SELECT c.name, o.total, o.order_date
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;

SELECT c.name, COALESCE(o.total, 0) as total
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

SELECT c.name, COUNT(o.id) as orders, SUM(o.total) as revenue
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY revenue DESC;',
  'sql',1,80,false),

  (18,'Aggregations والSubqueries','Aggregations and Subqueries',
  'الدوال التجميعية والاستعلامات الفرعية.',
  'Aggregate functions and subqueries.',
  'SELECT
    COUNT(*) as total,
    SUM(price) as revenue,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products;

SELECT category, COUNT(*) as cnt, AVG(price) as avg
FROM products
GROUP BY category
HAVING AVG(price) > 50
ORDER BY avg DESC;

SELECT name FROM products
WHERE price > (SELECT AVG(price) FROM products);',
  'sql',2,80,false);
  

  -- HTML LESSONS (chapter_ids 19=basics, 20=advanced)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (19,'مقدمة إلى HTML','Introduction to HTML',
  'HTML هي لغة ترميز النص التشعبي، أساس بناء صفحات الويب.',
  'HTML is HyperText Markup Language, the foundation of web pages.',
  '<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is <strong>bold</strong> and <em>italic</em>.</p>
    <a href="#">Click here</a>
</body>
</html>',
  'html',1,50,true),

  (19,'العناصر الأساسية','Basic Elements',
  'عناصر HTML الأساسية لبناء المحتوى.',
  'Basic HTML elements for building content.',
  '<h1>Main Title</h1>
<h2>Subtitle</h2>
<p>A paragraph of text.</p>
<a href="https://example.com">A link</a>
<ul>
    <li>First item</li>
    <li>Second item</li>
</ul>
<ol>
    <li>Step one</li>
    <li>Step two</li>
</ol>
<img src="photo.jpg" alt="A photo">',
  'html',2,50,true),

  (19,'الجداول','Tables',
  'إنشاء جداول لعرض البيانات بشكل منظم.',
  'Creating tables to display organized data.',
  '<table border="1" style="border-collapse: collapse; width: 100%">
  <thead>
    <tr style="background: #f0f0f0">
      <th>Name</th><th>Age</th><th>City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ahmed</td><td>25</td><td>Riyadh</td>
    </tr>
    <tr>
      <td>Sara</td><td>28</td><td>Jeddah</td>
    </tr>
  </tbody>
</table>',
  'html',3,60,false),

  (20,'النماذج Forms','Forms',
  'النماذج لجمع البيانات من المستخدمين.',
  'Forms for collecting data from users.',
  '<form action="/submit" method="POST">
  <label for="name">Name:</label><br>
  <input type="text" id="name" name="name" required><br><br>
  <label for="email">Email:</label><br>
  <input type="email" id="email" name="email"><br><br>
  <label>Gender:</label><br>
  <input type="radio" name="gender" value="male"> Male
  <input type="radio" name="gender" value="female"> Female<br><br>
  <label for="msg">Message:</label><br>
  <textarea id="msg" rows="4"></textarea><br><br>
  <button type="submit">Submit</button>
</form>',
  'html',1,60,false),

  (20,'HTML5 Semantic','HTML5 Semantic Elements',
  'عناصر HTML5 الدلالية لتنظيم الصفحة.',
  'HTML5 semantic elements for better page organization.',
  '<!DOCTYPE html>
<html>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  <main>
    <article>
      <h2>Article Title</h2>
      <section><p>Section 1</p></section>
      <section><p>Section 2</p></section>
    </article>
    <aside><p>Sidebar</p></aside>
  </main>
  <footer><p>Copyright 2024</p></footer>
</body>
</html>',
  'html',2,70,false);

  -- CSS LESSONS (chapter_ids 21=basics, 22=advanced)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (21,'مقدمة إلى CSS','Introduction to CSS',
  'CSS تتحكم في مظهر صفحات HTML من ألوان وخطوط وتخطيط.',
  'CSS controls HTML page appearance including colors, fonts, and layout.',
  'h1 {
    color: #333;
    font-size: 2rem;
    font-family: Arial, sans-serif;
}

.card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

a:hover {
    color: #0066cc;
    text-decoration: underline;
}',
  'css',1,50,true),

  (21,'الألوان والخطوط','Colors and Fonts',
  'التحكم في الألوان والخطوط في CSS.',
  'Controlling colors and fonts in CSS.',
  'body {
    font-family: "Segoe UI", Tahoma, sans-serif;
    font-size: 16px;
    color: #333;
    background: #f5f5f5;
}

h1 {
    color: #2c3e50;
    font-weight: 700;
    font-size: clamp(1.5rem, 4vw, 3rem);
}

.text-primary { color: #007bff; }
.text-success { color: #28a745; }',
  'css',2,50,true),

  (21,'Flexbox','Flexbox',
  'نظام Flexbox المرن لترتيب العناصر.',
  'Flexible Flexbox system for arranging elements.',
  '.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.item {
    flex: 1;
    min-width: 200px;
    padding: 1rem;
}

.centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}',
  'css',3,60,false),

  (22,'Grid Layout','Grid Layout',
  'CSS Grid نظام شبكي قوي للتخطيط.',
  'CSS Grid is a powerful grid system for layouts.',
  '.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.page {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
}',
  'css',1,70,false),

  (22,'Animations','Animations',
  'CSS Animations تضيف حركة للصفحات.',
  'CSS Animations add movement to pages.',
  '.button {
    background: #007bff;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    transition: all 0.3s ease;
}
.button:hover {
    background: #0056b3;
    transform: scale(1.05);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
}

.card { animation: fadeIn 0.5s ease forwards; }',
  'css',2,70,false);
  

  -- KOTLIN LESSONS (chapter_id 23)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (23,'مقدمة إلى Kotlin','Introduction to Kotlin',
'Kotlin لغة حديثة للـ JVM، اللغة الرسمية لتطوير Android.',
'Kotlin is a modern JVM language, the official language for Android development.',
'fun main() {\n    println("Hello, World!")\n    val name = "Ahmed"\n    var age = 25\n    age = 26\n    println("Name: " + name)\n    println("Age: " + age)\n}',
'kotlin',1,60,true),
  (23,'Data Classes','Data Classes',
'Data Classes مثالية لتمثيل البيانات في Kotlin.',
'Data Classes are perfect for representing data in Kotlin.',
'data class Person(val name: String, val age: Int)\n\nfun greet(p: Person): String = "Hello " + p.name + "! Age: " + p.age\n\nfun main() {\n    val person = Person("Sara", 28)\n    println(greet(person))\n    val updated = person.copy(age = 29)\n    println(updated)\n}',
'kotlin',2,70,true),
  (23,'Null Safety','Null Safety',
'Kotlin تمنع NullPointerException بنظام أنواع آمن.',
'Kotlin prevents NullPointerException with a safe type system.',
'fun main() {\n    var name: String? = "Ahmed"\n    println(name?.length)\n    val len = name?.length ?: 0\n    println("Length: " + len)\n    name = null\n    println(name ?: "No name")\n}',
'kotlin',3,80,false);

  -- SWIFT LESSONS (chapter_id 24)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (24,'مقدمة إلى Swift','Introduction to Swift',
'Swift لغة Apple الحديثة لتطوير iOS وmacOS.',
'Swift is Apple''s modern language for iOS and macOS development.',
'import Foundation\n\nprint("Hello, World!")\n\nlet name = "Ahmed"\nvar age = 25\nage = 26\n\nprint("Name: " + name)\nprint("Age: " + String(age))',
'swift',1,60,true),
  (24,'Optionals','Optionals',
'Optionals في Swift تجعل التعامل مع القيم الناقصة آمناً.',
'Optionals in Swift make handling missing values safe.',
'import Foundation\n\nvar name: String? = "Ahmed"\n\nif let n = name { print("Name: " + n) }\n\nfunc greet(_ name: String?) {\n    guard let name = name else { print("Invalid"); return }\n    print("Hello " + name + "!")\n}\n\ngreet("Sara")\ngreet(nil)\n\nlet display = name ?? "Unknown"\nprint(display)',
'swift',2,70,true);

  -- DART LESSONS (chapter_id 25)
  INSERT INTO lessons (chapter_id, title_ar, title_en, content_ar, content_en, code_example, language, "order", xp_reward, is_free) VALUES
  (25,'مقدمة إلى Dart','Introduction to Dart',
'Dart لغة Google لتطوير Flutter وتطبيقات متعددة المنصات.',
'Dart is Google''s language for Flutter and cross-platform apps.',
'void main() {
  print("Hello World!");
  String name = "Ahmed";
  int age = 25;
  print("Name: " + name);
  print("Age: " + age.toString());
}',
'dart',1,60,true),
  (25,'كلاسات Dart','Dart Classes',
'Dart موجهة للكائنات بالكامل مع دوال من الدرجة الأولى.',
'Dart is fully object-oriented with first-class functions.',
'class Rectangle {\n  final double width;\n  final double height;\n  const Rectangle(this.width, this.height);\n  double get area => width * height;\n  String toString() => "Rectangle " + width.toString() + "x" + height.toString();\n}\n\nvoid main() {\n  var rect = const Rectangle(5, 3);\n  print(rect);\n  print("Area: " + rect.area.toString());\n  var numbers = [1, 2, 3, 4, 5];\n  var doubled = numbers.map((n) => n * 2).toList();\n  print(doubled);\n}',
'dart',2,70,true);
  

  -- QUIZ QUESTIONS for all courses
  -- Python Lesson 1 (id=1)
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order") VALUES
  (1,'من أنشأ لغة Python؟','Who created Python?',
  '[{"id":"a","textAr":"Linus Torvalds","textEn":"Linus Torvalds"},{"id":"b","textAr":"Guido van Rossum","textEn":"Guido van Rossum"},{"id":"c","textAr":"James Gosling","textEn":"James Gosling"},{"id":"d","textAr":"Bjarne Stroustrup","textEn":"Bjarne Stroustrup"}]'::jsonb,
  'b','أنشأ Guido van Rossum لغة Python عام 1991','Guido van Rossum created Python in 1991',20,1),

  (1,'ما الذي يطبعه ()print("Hello World"؟','What does print("Hello World") output?',
  '[{"id":"a","textAr":"hello world","textEn":"hello world"},{"id":"b","textAr":"Hello World","textEn":"Hello World"},{"id":"c","textAr":"HELLO WORLD","textEn":"HELLO WORLD"},{"id":"d","textAr":"لا شيء","textEn":"Nothing"}]'::jsonb,
  'b','print يطبع النص كما هو مع مراعاة حالة الأحرف','print outputs text as-is, case-sensitive',20,2),

  (1,'ما وظيفة دالة ()print في Python؟','What does the print() function do in Python?',
  '[{"id":"a","textAr":"تحذف متغير","textEn":"Delete a variable"},{"id":"b","textAr":"تطبع نصاً على الشاشة","textEn":"Print text to screen"},{"id":"c","textAr":"تقرأ من لوحة المفاتيح","textEn":"Read from keyboard"},{"id":"d","textAr":"تنشئ ملفاً","textEn":"Create a file"}]'::jsonb,
  'b','print() تعرض النتيجة على الشاشة','print() displays output to screen',20,3);

  -- Python Lesson 2 (id=2)
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order") VALUES
  (2,'ما نوع المتغير: x = 10','What type is: x = 10',
  '[{"id":"a","textAr":"str","textEn":"str"},{"id":"b","textAr":"float","textEn":"float"},{"id":"c","textAr":"int","textEn":"int"},{"id":"d","textAr":"bool","textEn":"bool"}]'::jsonb,
  'c','العدد الصحيح 10 من نوع int','The integer 10 is of type int',20,1),

  (2,'ما نوع المتغير: x = 3.14','What type is: x = 3.14',
  '[{"id":"a","textAr":"int","textEn":"int"},{"id":"b","textAr":"float","textEn":"float"},{"id":"c","textAr":"str","textEn":"str"},{"id":"d","textAr":"bool","textEn":"bool"}]'::jsonb,
  'b','الرقم العشري 3.14 من نوع float','The decimal 3.14 is of type float',20,2);

  -- Python Lesson 3 (id=3)
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order") VALUES
  (3,'ما ناتج 10 // 3 في Python؟','What is 10 // 3 in Python?',
  '[{"id":"a","textAr":"3.33","textEn":"3.33"},{"id":"b","textAr":"3","textEn":"3"},{"id":"c","textAr":"1","textEn":"1"},{"id":"d","textAr":"10","textEn":"10"}]'::jsonb,
  'b','// هي عملية القسمة الصحيحة وتُرجع 3','// is integer division and returns 3',20,1),

  (3,'ما ناتج 10 % 3 في Python؟','What is 10 % 3 in Python?',
  '[{"id":"a","textAr":"3","textEn":"3"},{"id":"b","textAr":"0","textEn":"0"},{"id":"c","textAr":"1","textEn":"1"},{"id":"d","textAr":"7","textEn":"7"}]'::jsonb,
  'c','% هي باقي القسمة: 10 = 3x3 + 1','% is modulo: 10 = 3x3 + 1',20,2);

  -- Python Lesson 4 - Conditionals (id=4)
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order") VALUES
  (4,'ما الكلمة المفتاحية للشرط في Python؟','What is the keyword for conditionals in Python?',
  '[{"id":"a","textAr":"when","textEn":"when"},{"id":"b","textAr":"if","textEn":"if"},{"id":"c","textAr":"case","textEn":"case"},{"id":"d","textAr":"condition","textEn":"condition"}]'::jsonb,
  'b','if هي الكلمة المفتاحية للشرط في Python','if is the conditional keyword in Python',20,1);

  -- Python Lesson 5 - for loop (id=5)
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order") VALUES
  (5,'ما ناتج: for i in range(3): print(i)','What does: for i in range(3): print(i) output?',
  '[{"id":"a","textAr":"1 2 3","textEn":"1 2 3"},{"id":"b","textAr":"0 1 2","textEn":"0 1 2"},{"id":"c","textAr":"0 1 2 3","textEn":"0 1 2 3"},{"id":"d","textAr":"1 2","textEn":"1 2"}]'::jsonb,
  'b','range(3) يُنتج 0, 1, 2 (لا يشمل 3)','range(3) produces 0, 1, 2 (exclusive of 3)',20,1);

  -- JavaScript Lessons quiz - first JS lesson in chapter 4
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما الأمر المستخدم لطباعة شيء في JavaScript؟','What command prints to console in JavaScript?',
  '[{"id":"a","textAr":"print()","textEn":"print()"},{"id":"b","textAr":"console.log()","textEn":"console.log()"},{"id":"c","textAr":"System.out.println()","textEn":"System.out.println()"},{"id":"d","textAr":"echo","textEn":"echo"}]'::jsonb,
  'b','console.log() هو الأمر الأساسي للطباعة في JavaScript','console.log() is the primary print command in JavaScript',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'javascript' AND l."order" = 1 AND c."order" = 1;

  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما الفرق بين let و const في JavaScript؟','What is the difference between let and const in JavaScript?',
  '[{"id":"a","textAr":"لا فرق بينهما","textEn":"No difference"},{"id":"b","textAr":"let للمتغيرات، const للثوابت","textEn":"let for variables, const for constants"},{"id":"c","textAr":"const أسرع من let","textEn":"const is faster than let"},{"id":"d","textAr":"كلاهما يمكن تغييرهما","textEn":"Both can be changed"}]'::jsonb,
  'b','let يمكن إعادة تعيينه، const لا يمكن','let can be reassigned, const cannot',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'javascript' AND l."order" = 2 AND c."order" = 1;

  -- TypeScript first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما علاقة TypeScript بـ JavaScript؟','What is TypeScript''s relation to JavaScript?',
  '[{"id":"a","textAr":"لا علاقة بينهما","textEn":"No relation"},{"id":"b","textAr":"TypeScript هو JavaScript مع أنواع بيانات","textEn":"TypeScript is JavaScript with types"},{"id":"c","textAr":"TypeScript أسرع من JavaScript","textEn":"TypeScript is faster"},{"id":"d","textAr":"TypeScript تعوض JavaScript","textEn":"TypeScript replaces JavaScript"}]'::jsonb,
  'b','TypeScript يضيف الأنواع الثابتة فوق JavaScript','TypeScript adds static typing on top of JavaScript',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'typescript' AND l."order" = 1 AND c."order" = 1;

  -- C++ first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما الدالة الرئيسية في C++؟','What is the entry point function in C++?',
  '[{"id":"a","textAr":"start()","textEn":"start()"},{"id":"b","textAr":"run()","textEn":"run()"},{"id":"c","textAr":"main()","textEn":"main()"},{"id":"d","textAr":"begin()","textEn":"begin()"}]'::jsonb,
  'c','main() هي نقطة دخول برنامج C++','main() is the entry point of a C++ program',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'cpp' AND l."order" = 1 AND c."order" = 1;

  -- Java first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما مبدأ Java الشهير؟','What is Java''s famous principle?',
  '[{"id":"a","textAr":"أسرع لغة في العالم","textEn":"Fastest in the world"},{"id":"b","textAr":"اكتب مرة، شغّل في أي مكان","textEn":"Write once, run anywhere"},{"id":"c","textAr":"آمنة بلا أخطاء","textEn":"Safe without errors"},{"id":"d","textAr":"للمبتدئين فقط","textEn":"For beginners only"}]'::jsonb,
  'b','"اكتب مرة، شغّل في أي مكان" عبر JVM','"Write once, run anywhere" via JVM',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'java' AND l."order" = 1 AND c."order" = 1;

  -- Go first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'من طورت لغة Go؟','Who developed Go?',
  '[{"id":"a","textAr":"Microsoft","textEn":"Microsoft"},{"id":"b","textAr":"Apple","textEn":"Apple"},{"id":"c","textAr":"Google","textEn":"Google"},{"id":"d","textAr":"Meta","textEn":"Meta"}]'::jsonb,
  'c','Go طوّرتها Google عام 2009','Go was developed by Google in 2009',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'go' AND l."order" = 1 AND c."order" = 1;

  -- Rust first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما الميزة الرئيسية لـ Rust؟','What is Rust''s main feature?',
  '[{"id":"a","textAr":"سهلة التعلم جداً","textEn":"Very easy to learn"},{"id":"b","textAr":"الأمان في الذاكرة بدون GC","textEn":"Memory safety without GC"},{"id":"c","textAr":"أسرع لغة في العالم","textEn":"World fastest language"},{"id":"d","textAr":"تدعم كل المنصات","textEn":"Supports all platforms"}]'::jsonb,
  'b','Rust توفر أمان الذاكرة بدون Garbage Collector','Rust provides memory safety without a Garbage Collector',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'rust' AND l."order" = 1 AND c."order" = 1;

  -- C# first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'C# تعمل على أي إطار عمل؟','C# runs on which framework?',
  '[{"id":"a","textAr":"JVM","textEn":"JVM"},{"id":"b","textAr":"Node.js","textEn":"Node.js"},{"id":"c","textAr":".NET","textEn":".NET"},{"id":"d","textAr":"Python VM","textEn":"Python VM"}]'::jsonb,
  'c','C# تعمل على إطار .NET من Microsoft','C# runs on Microsoft .NET framework',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'csharp' AND l."order" = 1 AND c."order" = 1;

  -- PHP first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما تخصص لغة PHP؟','What is PHP specialized for?',
  '[{"id":"a","textAr":"تطوير تطبيقات الهاتف","textEn":"Mobile apps"},{"id":"b","textAr":"الذكاء الاصطناعي","textEn":"AI"},{"id":"c","textAr":"تطوير الويب من جانب الخادم","textEn":"Server-side web dev"},{"id":"d","textAr":"برمجة الأنظمة","textEn":"Systems programming"}]'::jsonb,
  'c','PHP مخصصة لتطوير الويب من جانب الخادم','PHP is specialized for server-side web development',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'php' AND l."order" = 1 AND c."order" = 1;

  -- SQL first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ماذا يرمز SQL؟','What does SQL stand for?',
  '[{"id":"a","textAr":"Simple Query Language","textEn":"Simple Query Language"},{"id":"b","textAr":"Structured Query Language","textEn":"Structured Query Language"},{"id":"c","textAr":"Sequential Query Language","textEn":"Sequential Query Language"},{"id":"d","textAr":"Standard Query Language","textEn":"Standard Query Language"}]'::jsonb,
  'b','SQL = Structured Query Language','SQL = Structured Query Language',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'sql' AND l."order" = 1 AND c."order" = 1;

  -- HTML first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ماذا تعني HTML؟','What does HTML stand for?',
  '[{"id":"a","textAr":"Hyper Transfer Markup Language","textEn":"Hyper Transfer Markup Language"},{"id":"b","textAr":"HyperText Markup Language","textEn":"HyperText Markup Language"},{"id":"c","textAr":"High Text Making Language","textEn":"High Text Making Language"},{"id":"d","textAr":"Hyper Type Making Language","textEn":"Hyper Type Making Language"}]'::jsonb,
  'b','HTML = HyperText Markup Language','HTML = HyperText Markup Language',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'html' AND l."order" = 1 AND c."order" = 1;

  -- CSS first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما وظيفة CSS؟','What is CSS used for?',
  '[{"id":"a","textAr":"تخزين البيانات","textEn":"Storing data"},{"id":"b","textAr":"تصميم وتنسيق صفحات الويب","textEn":"Styling web pages"},{"id":"c","textAr":"برمجة المنطق","textEn":"Programming logic"},{"id":"d","textAr":"إدارة الخوادم","textEn":"Managing servers"}]'::jsonb,
  'b','CSS تتحكم في مظهر وتنسيق صفحات HTML','CSS controls the appearance and styling of HTML pages',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'css' AND l."order" = 1 AND c."order" = 1;

  -- Kotlin first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما اللغة الرسمية لتطوير Android؟','What is the official language for Android development?',
  '[{"id":"a","textAr":"Java فقط","textEn":"Java only"},{"id":"b","textAr":"Swift","textEn":"Swift"},{"id":"c","textAr":"Kotlin","textEn":"Kotlin"},{"id":"d","textAr":"C++","textEn":"C++"}]'::jsonb,
  'c','Google أعلنت Kotlin اللغة الرسمية لـ Android عام 2019','Google declared Kotlin the official Android language in 2019',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'kotlin' AND l."order" = 1 AND c."order" = 1;

  -- Swift first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'من طورت لغة Swift؟','Who developed Swift?',
  '[{"id":"a","textAr":"Google","textEn":"Google"},{"id":"b","textAr":"Microsoft","textEn":"Microsoft"},{"id":"c","textAr":"Apple","textEn":"Apple"},{"id":"d","textAr":"Amazon","textEn":"Amazon"}]'::jsonb,
  'c','Apple طوّرت Swift عام 2014 لتطوير iOS وmacOS','Apple developed Swift in 2014 for iOS and macOS',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'swift' AND l."order" = 1 AND c."order" = 1;

  -- Dart first lesson quiz
  INSERT INTO quiz_questions (lesson_id, question_ar, question_en, options, correct_option_id, explanation_ar, explanation_en, xp_reward, "order")
  SELECT l.id,
  'ما إطار العمل المشهور المبني على Dart؟','What popular framework is built on Dart?',
  '[{"id":"a","textAr":"React Native","textEn":"React Native"},{"id":"b","textAr":"Flutter","textEn":"Flutter"},{"id":"c","textAr":"Xamarin","textEn":"Xamarin"},{"id":"d","textAr":"Ionic","textEn":"Ionic"}]'::jsonb,
  'b','Flutter إطار Google لبناء تطبيقات متعددة المنصات باستخدام Dart','Flutter is Google''s framework for cross-platform apps using Dart',20,1
  FROM lessons l JOIN chapters c ON l.chapter_id = c.id JOIN courses co ON c.course_id = co.id
  WHERE co.slug = 'dart' AND l."order" = 1 AND c."order" = 1;

  -- Verify
  SELECT 
      (SELECT COUNT(*) FROM courses) as total_courses,
      (SELECT COUNT(*) FROM chapters) as total_chapters,
      (SELECT COUNT(*) FROM lessons) as total_lessons,
      (SELECT COUNT(*) FROM quiz_questions) as total_quizzes;
  