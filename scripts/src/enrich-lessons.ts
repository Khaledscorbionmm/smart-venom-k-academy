/**
 * Script to enrich lesson code_examples with detailed Arabic comments
 * and simplify contentAr/contentEn for trainee readability.
 *
 * Run: pnpm tsx scripts/src/enrich-lessons.ts
 */

import { Client } from "pg";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL required"); process.exit(1); }

const client = new Client({ connectionString: url });

/** Detailed Arabic inline comments for Python lessons */
const PYTHON_ENRICHMENTS: Record<number, { codeExample: string; contentAr: string; contentEn: string }> = {
  1: {
    codeExample: `print("Hello, World!")          # <-- اطبع رسالة ترحيب
print("مرحباً بالعالم!")           # <-- نفس الفكرة بالعربية

# -------------------------------------------------
# التعليق: أي نص بعد علامة # يُعتبر تعليقاً.
# المترجم يتجاهله تماماً... هو فقط للبشر!
# -------------------------------------------------

name = "Smart Venom K"            # <-- أنشأنا "صندوق" اسمه name وحطينا فيه نص
print(f"Welcome to {name} Academy!")  # <-- الطباعة المتقدمة: f"..." تسمح بدمج المتغير`,
    contentAr: `أهلاً بك في أول درس Python!

**ماذا سنتعلم؟**
1. كيف نكتب أول سطر كود
2. كيف نطبع أي نص على الشاشة
3. ما هو "التعليق" ولماذا نحتاجه؟

**فكرة بسيطة:**
دالة \`print()\` مثل "ماكينة طباعة" — تعطيها أي نص، تظهره لك فوراً.

**مثال من الحياة:**
عندما تكتب رسالة واتساب وتضغط "إرسال"... print() هي نفس الفكرة!

**نصيحة ذهبية:**
اكتب تعليقاً (#) فوق كل سطر غامض. مستقبلاً ستشكر نفسك!`,
    contentEn: `Welcome to your first Python lesson!

**What you'll learn:**
1. How to write your first line of code
2. How to print any text on screen
3. What is a "comment" and why it matters

**Simple idea:**
The \`print()\` function is like a "printing machine" — give it text, it shows it instantly.

**Real-life example:**
When you write a WhatsApp message and hit "send"... print() is the same idea!

**Golden tip:**
Write a comment (#) above any confusing line. Future-you will thank you!`,
  },

  2: {
    codeExample: `age = 25                # <-- أنشأنا متغير "age" وحطينا فيه رقم 25
height = 1.75           # <-- متغير "height" مع قيمة عشرية
name = "Ahmed"          # <-- متغير نصي (string) — دائماً بين ""
is_student = True       # <-- متغير منطقي: True أو False فقط

# -------------------------------------------------
# Python ذكي! لا تحتاج لتحديد نوع البيانات مسبقاً.
# فقط اكتب اسم = قيمة ... وهو يفهم تلقائياً!
# -------------------------------------------------

print(type(age))        # <-- نستدعي "type()" لنسأل: ما نوع age؟
                        # النتيجة: <class 'int'>  ... يعني "رقم صحيح"

print(type(height))     # <-- النتيجة: <class 'float'> ... يعني "رقم عشري"

print(type(name))       # <-- النتيجة: <class 'str'> ... يعني "نص"

print(type(is_student)) # <-- النتيجة: <class 'bool'> ... يعني "صح/خطأ"`,
    contentAr: `في هذا الدرس نتعلم "المتغيرات" — وهي صناديق صغيرة في ذاكرة الكمبيوتر!

**التشبيه العملي:**
تخيل أن المتغير مثل "علبة مؤن" في المطبخ:
- \`age = 25\` = علبة اسمها "age" بداخلها 25 تفاحة
- \`name = "Ahmed"\` = علبة اسمها "name" بداخلها ورقة مكتوب عليها "Ahmed"

**لماذا لا نكتب النوع؟**
Python ذكي — يعرف تلقائياً أن 25 رقم و"Ahmed" نص.

**الأنواع الأساسية:**
1. \`int\` = رقم صحيح (25, 100, -5)
2. \`float\` = رقم عشري (1.75, 3.14)
3. \`str\` = نص ("مرحباً", 'Hello')
4. \`bool\` = صح/خطأ (True, False)

**كيف نكتشف نوع المتغير؟**
استخدم \`type(اسم_المتغير)\` والنتيجة تظهر فوراً!`,
    contentEn: `In this lesson we learn "Variables" — tiny boxes inside the computer's memory!

**Practical analogy:**
Imagine a variable is like a "storage container" in the kitchen:
- \`age = 25\` = a box named "age" containing 25 apples
- \`name = "Ahmed"\` = a box named "name" with a note saying "Ahmed"

**Why don't we write the type?**
Python is smart — it automatically knows 25 is a number and "Ahmed" is text.

**Basic types:**
1. \`int\` = whole number (25, 100, -5)
2. \`float\` = decimal number (1.75, 3.14)
3. \`str\` = text ("hello", 'world')
4. \`bool\` = true/false (True, False)

**How to discover the type?**
Use \`type(variable_name)\` and the result shows instantly!`,
  },

  3: {
    codeExample: `a = 10                    # <-- أول رقم نريد العمل عليه
b = 3                     # <-- ثاني رقم

# -------------------------------------------------
# العمليات الحسابية: نفس رموز الآلة الحاسبة!
# + = جمع    - = طرح    * = ضرب    / = قسمة
# -------------------------------------------------

print(a + b)              # <-- 10 + 3 = 13 ... جمع
print(a - b)              # <-- 10 - 3 = 7 ... طرح
print(a * b)              # <-- 10 × 3 = 30 ... ضرب
print(a / b)              # <-- 10 ÷ 3 = 3.333... ... قسمة

# -------------------------------------------------
# عمليات إضافية: الأسس والباقي والقسمة الصحيحة
# -------------------------------------------------

print(a ** b)             # <-- 10 أس 3 = 10×10×10 = 1000
print(a % b)              # <-- باقي قسمة 10÷3 = 1 (لأن 3×3=9 والباقي 1)
print(a // b)             # <-- قسمة صحيحة: 10÷3 = 3 بدون كسور`,
    contentAr: `في هذا الدرس نتعلم الحساب باستخدام Python!

**الأخبار السارة:**
Python يستخدم نفس رموز الآلة الحاسبة التي تعرفها:
- \`+\` للجمع
- \`-\` للطرح
- \`*\` للضرب
- \`/\` للقسمة

**عمليات متقدمة (مفيدة جداً):**
- \`**\` = الأس (10 ** 3 يعني 10³ = 1000)
- \`%\` = الباقي (10 % 3 = 1)
- \`//\` = القسمة الصحيحة (10 // 3 = 3)

**لماذا نحتاج الباقي (%):**
فكّر في موقف: هل 100 جنيه يكفي لشراء 3 تذاكر بـ 30 جنيه؟
100 % 30 = 10 ... يعني يبقى معك 10 جنيه!`,
    contentEn: `In this lesson we do math using Python!

**Good news:**
Python uses the same symbols as your calculator:
- \`+\` for addition
- \`-\` for subtraction
- \`*\` for multiplication
- \`/\` for division

**Advanced operations (very useful):**
- \`**\` = power (10 ** 3 means 10³ = 1000)
- \`%\` = remainder (10 % 3 = 1)
- \`//\` = floor division (10 // 3 = 3)

**Why do we need remainder (%):**
Imagine: do you have enough money for 3 tickets at 30 each?
100 % 30 = 10 ... means 10 left over!`,
  },

  4: {
    codeExample: `name = "Smart Venom K"       # <-- أنشأنا نصاً (string) وحفظناه

# -------------------------------------------------
# الخاصية (Property): len() = الطول = عدد الحروف
# -------------------------------------------------

print(len(name))              # <-- len = length = 12 حرف

# -------------------------------------------------
# التقطيع (Slicing): نأخذ جزءاً من النص
# name[0:5] يعني: من الحرف رقم 0 إلى الحرف رقم 4
# (الرقم الأخير لا يُضمّن!)
# -------------------------------------------------

print(name[0:5])              # <-- "Smart" ... الحروف 0-4
print(name[6:11])             # <-- "Venom" ... الحروف 6-10

# -------------------------------------------------
# الدمج: + يجمع نصين معاً
# -------------------------------------------------

greeting = "Welcome to " + name + " Academy!"
print(greeting)               # <-- "Welcome to Smart Venom K Academy!"`,
    contentAr: `النصوص (Strings) هي أهم نوع بيانات في البرمجة!

**ما هو النص؟**
أي شيء بين علامتي تنصيص: "مرحباً" أو 'Hello'

**العمليات على النصوص:**
1. \`len()\` = عدد الحروف (len("مرحباً") = 6)
2. \`[start:end]\` = تقطيع جزء من النص
3. \`+\` = دمج نصين

**فكرة التقطيع [start:end]:**
تخيل نص طويل كشريط لاصق. \`[0:5]\` يعني: قص من البداية حتى الحرف رقم 4 (الـ 5 لا يُحسب!).

**تمرين ذهني:**
إذا كان اسمك = "Ahmed"، ما ناتج "Ahmed"[0:2]؟
الجواب: "Ah" (الحرف 0=A والحرف 1=h، والحرف 2 لا يُضمّن).`,
    contentEn: `Strings are the most important data type in programming!

**What is a string?**
Anything between quotes: "hello" or 'world'

**String operations:**
1. \`len()\` = count characters (len("hello") = 5)
2. \`[start:end]\` = slice a portion
3. \`+\` = combine two strings

**Slicing idea [start:end]:**
Imagine a long text like a tape. \`[0:5]\` means: cut from the start to character #4 (the 5th is NOT included!).

**Mental exercise:**
If your name is "Ahmed", what is "Ahmed"[0:2]?
Answer: "Ah" (character 0=A, character 1=h, character 2 is NOT included).`,
  },

  5: {
    codeExample: `# -------------------------------------------------
# input() = نافذة حوار: يسأل المستخدم وينتظر رده
# النتيجة دائماً نص (string)!
# -------------------------------------------------

name = input("Enter your name: ")   # <-- يظهر رسالة وينتظر
print(f"Hello, {name}!")            # <-- نستخدم ما كتبه المستخدم

# -------------------------------------------------
# التحذير المهم: input() يُرجع نصاً!
# لو نريد رقماً... يجب التحويل يدوياً
# -------------------------------------------------

age_text = input("Enter your age: ")     # <-- نص: "25"
age_number = int(age_text)               # <-- حوّلنا النص إلى رقم

birth_year = 2025 - age_number           # <-- الآن يمكننا الحساب!
print(f"You were born around {birth_year}")`,
    contentAr: `في هذا الدرس نتعلم كيف نتحدث مع المستخدم!

**دالة input() مثل صندوق بريد:**
- تكتب رسالة ("Enter your name:")
- تنتظر رد المستخدم
- تُرجع الرد كنص (string)

**الفخ الشائع:**
لو المستخدم كتب 25 ... input() تعتبرها "25" (نص) وليس 25 (رقم)!
لا يمكنك حساب 2025 - "25" — Python يشتكي!

**الحل:**
استخدم \`int()\` لتحويل النص إلى رقم
استخدم \`float()\` لو القيمة تحتوي على كسور

**تطبيق حياتي:**
تطبيق حاسبة العمر: يسألك عن عمرك ويحسب سنة ميلادك تلقائياً!`,
    contentEn: `In this lesson we learn how to talk to the user!

**The input() function is like a mailbox:**
- You write a message ("Enter your name:")
- It waits for the user's reply
- It returns the reply as text (string)

**Common trap:**
If the user types 25 ... input() treats it as "25" (text) not 25 (number)!
You can't calculate 2025 - "25" — Python will complain!

**The fix:**
Use \`int()\` to convert text to a whole number
Use \`float()\` if the value has decimals

**Real-world app:**
Age calculator app: asks your age and calculates your birth year automatically!`,
  },

  6: {
    codeExample: `score = 85                # <-- درجة الطالب... لنحسب تقديره

# -------------------------------------------------
# if = لو   |   elif = وإلا لو   |   else = وإلا
# -------------------------------------------------

if score >= 90:                      # <-- لو الدرجة 90 أو أكثر
    grade = "A - ممتاز"             # <-- حطينا "ممتاز" في صندوق grade
    print("🎉 أحسنت! درجة ممتازة!")   # <-- رسالة تحفيز

elif score >= 80:                    # <-- وإلا لو الدرجة 80 أو أكثر
    grade = "B - جيد جداً"          # <-- تقدير جيد جداً
    print("👍 عمل رائع! استمر!")      # <-- رسالة تشجيع

elif score >= 70:                    # <-- وإلا لو 70 أو أكثر
    grade = "C - جيد"               # <-- تقدير جيد
    print("💪 جيد! يمكنك التحسن.")    # <-- تشجيع على التحسن

elif score >= 60:                    # <-- وإلا لو 60 أو أكثر
    grade = "D - مقبول"             # <-- نجحت بصعوبة
    print("⚠️ نجحت... لكن حاول أكثر.") # <-- تنبيه

else:                                # <-- أي شيء أقل من 60
    grade = "F - راسب"              # <-- للأسف راسب
    print("❌ لم تنجح. لا تيأس! حاول مرة أخرى.")  # <-- تهدئة

# -------------------------------------------------
# النتيجة النهائية
# -------------------------------------------------

print(f"درجتك: {score} — تقديرك: {grade}")`,
    contentAr: `الشروط (if/elif/else) = عقل البرنامج الذي يتخذ القرارات!

**التشبيه العملي:**
أنت على طريق متفرع:
- لو (if) إشارة المرور خضراء ← امشِ
- وإلا لو (elif) إشارة صفراء ← استعد
- وإلا (else) ← توقف

**قواعد مهمة:**
1. \`if\` يبدأ الشروط (واجب)
2. \`elif\" (اختياري) = "وإلا لو"
3. \`else\` (اختياري) = "في أي حالة أخرى"
4. \`>=\` = "أكبر من أو يساوي"
5. التباعد (4 مسافات) مهم جداً! بدونه Python يتألم.

**لماذا نبدأ من الأعلى؟**
لو بدأنا من 60: درجة 85 سيتم تصنيفها "مقبول" (D) بدلاً من "جيد جداً" (B)!
لذا نبدأ من الأعلى: 90 → 80 → 70 → 60 → باقي.`,
    contentEn: `Conditions (if/elif/else) = the program's brain that makes decisions!

**Practical analogy:**
You're at a fork in the road:
- If (if) the traffic light is green → go
- Else if (elif) it's yellow → prepare
- Else (else) → stop

**Important rules:**
1. \`if\` starts the conditions (required)
2. \`elif\` (optional) = "otherwise if"
3. \`else\` (optional) = "in any other case"
4. \`>=\` = "greater than or equal to"
5. Indentation (4 spaces) is crucial! Without it Python complains.

**Why start from the top?**
If we started at 60: a score of 85 would be labeled "acceptable" (D) instead of "very good" (B)!
So we start from the top: 90 → 80 → 70 → 60 → rest.`,
  },

  7: {
    codeExample: `# -------------------------------------------------
# for = كرّر... عدد معروف من المرات
# range(5) = تولد الأرقام: 0, 1, 2, 3, 4
# (تذكر: العدد الأخير لا يُضمّن!)
# -------------------------------------------------

print("=== التكرار على range ===")
for i in range(5):              # <-- i ستأخذ القيم: 0, 1, 2, 3, 4
    print(i)                    # <-- اطبع الرقم الحالي

# -------------------------------------------------
# التكرار على قائمة (List)
# -------------------------------------------------

print("=== التكرار على قائمة ===")
fruits = ["apple", "banana", "cherry"]   # <-- قائمة فواكه

for fruit in fruits:            # <-- fruit ستأخذ: "apple", "banana", "cherry"
    print(fruit)                # <-- اطبع الفاكهة الحالية

# -------------------------------------------------
# enumerate() = نحصل على الرقم والقيمة معاً
# -------------------------------------------------

print("=== مع الترقيم ===")
for i, fruit in enumerate(fruits):       # <-- i=الرقم، fruit=القيمة
    print(f"{i + 1}. {fruit}")            # <-- "1. apple"، "2. banana"...`,
    contentAr: `حلقة for = آلة تكرار! تقوم بنفس العملية عدة مرات.

**أنواع التكرار:**
1. \`range(5)\` = كرر 5 مرات (0, 1, 2, 3, 4)
2. \`for item in list\` = كرر على كل عنصر في قائمة
3. \`enumerate()\` = كرر مع الترقيم (1, 2, 3...)

**التشبيه:**
حلقة for مثل "المشاة العسكرية":
- قائد يقول "خطوة!"
- كل جندي يأخذ دوره
- يتكرر حتى ينتهى الصف

**لماذا نبدأ من صفر؟**
Python والكمبيوتر يبدآن من 0 لا من 1. تخيل 5 كراسي: الأول رقم 0، الثاني رقم 1... الخامس رقم 4.
range(5) = 0,1,2,3,4 (خمسة أرقام!).`,
    contentEn: `The for loop = a repetition machine! It does the same action multiple times.

**Types of repetition:**
1. \`range(5)\` = repeat 5 times (0, 1, 2, 3, 4)
2. \`for item in list\` = repeat over each item in a list
3. \`enumerate()\` = repeat with numbering (1, 2, 3...)

**Analogy:**
A for loop is like "military marching":
- A leader says "Step!"
- Each soldier takes their turn
- Repeats until the row ends

**Why start from zero?**
Python and computers start from 0, not 1. Imagine 5 chairs: first is #0, second is #1... fifth is #4.
range(5) = 0,1,2,3,4 (five numbers!).`,
  },

  8: {
    codeExample: `count = 0                   # <-- عداد نبدأه من صفر

# -------------------------------------------------
# while = كرّر... طالما الشرط صحيح
# تذكر: يجب تغيير الشرط داخل الحلقة وإلا تتكرر للأبد!
# -------------------------------------------------

while count < 5:            # <-- طالما العداد أقل من 5...
    print(f"Count: {count}")  # <-- اطبع العداد الحالي
    count = count + 1         # <-- زِد العداد بواحد (مهم جداً!)

print("انتهى العداد!")      # <-- نصل هنا فقط بعد انتهاء while

# -------------------------------------------------
# مثال عملي: نسأل المستخدم حتى يدخل رقم صحيح
# -------------------------------------------------

number = -1                 # <-- قيمة ابتدائية غير صحيحة

while number < 0:         # <-- طالما الرقم سالب...
    text = input("Enter a positive number: ")
    number = int(text)    # <-- حوّل النص إلى رقم

print(f"شكراً! الرقم المُدخل: {number}")`,
    contentAr: `حلقة while = "اكرر طالما..." — مفيدة عندما لا نعرف عدد التكرارات مسبقاً.

**الفرق بين for و while:**
- \`for\` = نعرف عدد التكرارات (5 مرات، 10 مرات)
- \`while\` = لا نعرف... نكرر حتى يتحقق شرط معين

**التحذير المهم:**
لو نسيت زيادة المتغير داخل while (count = count + 1)...
الحلقة تتكرر للأبد! (infinite loop)

**تشبيه حياتي:**
أنت في مطعم:
- while الجوع موجود:
  - كل قضمة
  - اسأل نفسك: هل ما زلت جائعاً؟
- انتهى الأكل!

**متى نستخدم while؟**
- قراءة بيانات حتى ينتهي الملف
- طلب إدخال من المستخدم حتى يكون صحيحاً
- انتظار استجابة من خادم (server)`,
    contentEn: `The while loop = "repeat while..." — useful when we don't know how many repetitions.

**Difference between for and while:**
- \`for\` = we know the count (5 times, 10 times)
- \`while\` = we don't know... repeat until a condition is met

**Important warning:**
If you forget to increase the variable inside while (count = count + 1)...
the loop repeats forever! (infinite loop)

**Life analogy:**
You're at a restaurant:
- while hunger exists:
  - take a bite
  - ask yourself: am I still hungry?
- finished eating!

**When to use while?**
- Reading data until the file ends
- Asking for user input until it's correct
- Waiting for a server response`,
  },

  9: {
    codeExample: `# -------------------------------------------------
# الطريقة التقليدية: نكتب for + if + append
# -------------------------------------------------

squares = []                # <-- قائمة فارغة نملأها لاحقاً

for i in range(10):         # <-- كرر 10 مرات: 0 إلى 9
    if i % 2 == 0:          # <-- لو الرقم زوجي (باقي قسمته على 2 = 0)
        squares.append(i * i)  # <-- أضف مربعه للقائمة

print(squares)              # <-- [0, 4, 16, 36, 64]

# -------------------------------------------------
# Comprehension: نفس الفكرة في سطر واحد فقط!
# -------------------------------------------------

squares_fast = [i * i for i in range(10) if i % 2 == 0]
                            # ^ النتيجة  ^ التكرار       ^ الشرط

print(squares_fast)         # <-- نفس النتيجة: [0, 4, 16, 36, 64]

# -------------------------------------------------
# تفسير بنية Comprehension:
# [result for item in collection if condition]
# [ما نريده   لكل    عنصر    في    المجموعة   لو تحقق الشرط]
# -------------------------------------------------`,
    contentAr: `Comprehension = "الاختصار العبقري" ... تحوّل 4 أسطر إلى سطر واحد!

**قارن:**
الطريقة التقليدية = 6 أسطر (for + if + append)
Comprehension = سطر واحد فقط!

**البنية العامة:**
\`[result for item in collection if condition]\`

**الترجمة العربية:**
\`[ما نريده لكل عنصر في المجموعة لو تحقق الشرط]\`

**مثال آخر:**
\`[x * 2 for x in [1,2,3,4,5] if x > 2]\`
= \`[6, 8, 10]\`
(ضاعف كل عنصر > 2)

**نصيحة:**
Comprehension أسرع وأقصر... لكن إذا أصبح معقداً جداً، عُد للطريقة التقليدية (for) لتبقى مقروءة.`,
    contentEn: `Comprehension = "the genius shortcut" ... turns 4 lines into 1 line!

**Compare:**
Traditional way = 6 lines (for + if + append)
Comprehension = just 1 line!

**General structure:**
\`[result for item in collection if condition]\`

**Another example:**
\`[x * 2 for x in [1,2,3,4,5] if x > 2]\`
= \`[6, 8, 10]\`
(double every item > 2)

**Tip:**
Comprehension is faster and shorter... but if it gets too complex, go back to the traditional for loop for readability.`,
  },

  10: {
    codeExample: `def greet(name, language="ar"):
    """
    دالة ترحيب: ترجع رسالة باللغة المطلوبة
    name: اسم الشخص (نص)
    language: "ar" للعربية أو "en" للإنجليزية
    """
    if language == "ar":                # <-- لو اللغة عربية
        return f"أهلاً {name}!"        # <-- رجّع نص عربي
    return f"Hello {name}!"             # <-- وإلا... رجّع نص إنجليزي

# -------------------------------------------------
# استدعاء الدالة (Calling the function)
# -------------------------------------------------

msg1 = greet("Ahmed")                 # <-- language افتراضي = "ar"
print(msg1)                           # <-- "أهلاً Ahmed!"

msg2 = greet("Ahmed", "en")           # <-- غيّرنا اللغة إلى إنجليزي
print(msg2)                           # <-- "Hello Ahmed!"

# -------------------------------------------------
# دالة ترجع أكثر من قيمة (unpacking)
# -------------------------------------------------

def min_max(lst):
    """ترجع أصغر وأكبر قيمة في قائمة"""
    return min(lst), max(lst)           # <-- ترجع زوج (tuple)

lo, hi = min_max([3, 1, 4, 1, 5, 9])  # <-- lo=1, hi=9
print(f"Min: {lo}, Max: {hi}")        # <-- "Min: 1, Max: 9"`,
    contentAr: `الدوال (Functions) = صناديق سحرية: تستقبل مدخلات وتُخرج نتائج!

**لماذا نحتاج دوال؟**
1. نكتب الكود مرة واحدة... ونستدعيه 100 مرة
2. نُقسّم البرنامج الكبير إلى قطع صغيرة
3. يسهل التعديل: غيّر مكان واحد، يتغيّر كل مكان

**البنية:**
\`def اسم(مُعامل1, مُعامل2=قيمة_افتراضية):\`

**القيمة الافتراضية:**
\`language="ar"\` = لو المستخدم لم يذكر اللغة... افترض عربي

**return = التسليم:**
مثل عامل توصيل: يأخذ الطلب (input) ويُرجع الطعام (result).

**Unpacking = فك العبوة:**
\`lo, hi = min_max(...)\`
الدالة ترجع زوج (1, 9) ... نفكه إلى متغيرين منفصلين!`,
    contentEn: `Functions = magic boxes: they receive inputs and produce outputs!

**Why do we need functions?**
1. Write code once... call it 100 times
2. Split a big program into small pieces
3. Easy to change: change one place, it changes everywhere

**Structure:**
\`def name(param1, param2=default_value):\`

**Default value:**
\`language="ar"\` = if the user doesn't mention language... assume Arabic

**return = delivery:**
Like a delivery worker: takes the order (input) and brings the food (result).

**Unpacking = open the package:**
\`lo, hi = min_max(...)\`
The function returns a pair (1, 9) ... we unpack it into two separate variables!`,
  },
};

async function main() {
  await client.connect();
  console.log("Connected to DB");

  let updated = 0;
  for (const [idStr, data] of Object.entries(PYTHON_ENRICHMENTS)) {
    const id = parseInt(idStr, 10);
    const res = await client.query(
      `UPDATE lessons SET code_example = $1, content_ar = $2, content_en = $3 WHERE id = $4`,
      [data.codeExample, data.contentAr, data.contentEn, id]
    );
    if (res.rowCount > 0) {
      console.log(`Updated lesson ${id}`);
      updated++;
    } else {
      console.log(`Lesson ${id} not found`);
    }
  }

  console.log(`\nDone! Updated ${updated} lessons.`);
  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
