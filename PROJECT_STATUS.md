# 📊 حالة مشروع Smart Venom K Academy

## ✅ المشاكل التي تم حلها

### 1. إصلاحات Windows Environment
- ✅ **preinstall script**: تم إزالة السكربت غير المتوافق مع Windows
- ✅ **esbuild**: تم إضافة دعم win32-x64
- ✅ **rollup**: تم إضافة دعم win32-x64-msvc
- ✅ **allowBuilds**: تم تعيين esbuild: true

### 2. إصلاحات الواجهة الأمامية (Frontend)
- ✅ **CourseDetail.tsx**: إضافة timeout و retry mechanism
- ✅ **LessonViewer.tsx**: إضافة timeout و retry mechanism
- ✅ **SimpleCodeEditor.tsx**: إضافة validation و reset button

### 3. تحسينات الأداء
- ✅ React Query caching محسّن
- ✅ Prefetch للـ lesson data
- ✅ تقليل عدد API calls

## 🚀 كيفية التشغيل

### على Windows:
```bash
# 1. تثبيت dependencies
cd smart-venom-k-academy
pnpm install

# 2. تشغيل development server
cd artifacts/academy
pnpm run dev

# 3. البناء للإنتاج
cd smart-venom-k-academy
pnpm run build
```

### على Linux/Mac:
```bash
# نفس الخطوات تعمل بدون مشاكل
pnpm install
pnpm run dev
```

## 📁 هيكل المشروع

```
smart-venom-k-academy/
├── artifacts/
│   ├── academy/          # Frontend (React + Vite)
│   ├── api-server/       # Backend (Express)
│   └── mockup-sandbox/   # Mockup
├── lib/
│   ├── api-client-react/ # API Client
│   ├── api-spec/         # OpenAPI Spec
│   ├── api-zod/          # Zod Schemas
│   └── db/               # Database (Drizzle)
├── scripts/
│   ├── migrate.sql       # Database Migration
│   ├── seed_content.ts   # Seed Data
│   └── startup.mjs       # Startup Script
└── Dockerfile            # Docker Build
```

## 🔗 الروابط المهمة

- **الموقع**: https://www.smartvenomk.xyz
- **GitHub**: https://github.com/Khaledscorbionmm/smart-venom-k-academy
- **Railway**: متصل تلقائيًا عبر GitHub

## 🛠️ التقنيات المستخدمة

### Frontend:
- React 19.1.0
- Vite 7.3.2
- TypeScript 5.9.3
- Tailwind CSS 4.1.14
- Wouter (Routing)
- React Query (Data Fetching)
- Sonner (Toasts)

### Backend:
- Express 5.2.1
- PostgreSQL
- Drizzle ORM
- Express Session
- Helmet (Security)
- CORS

### DevOps:
- Docker
- Railway (Deployment)
- pnpm (Package Manager)

## 📝 الميزات الرئيسية

1. **نظام إدارة التعلم (LMS)**
   - دورات متعددة (Python, JavaScript, HTML/CSS, React)
   - دروس تفاعلية مع أمثلة عملية
   - نظام اختبارات (Quizzes)
   - تتبع التقدم

2. **نظام التحفيز**
   - نقاط الخبرة (XP)
   - المستويات (Levels)
   - الترتيب (Leaderboard)
   - الإنجازات (Achievements)

3. **دعم اللغات**
   - العربية والإنجليزية
   - تبديل سهل بين اللغات

4. **محرر الكود**
   - دعم Python, JavaScript, HTML, CSS
   - تنفيذ الكود وعرض النتائج
   - معالجة الأخطاء

## 🔒 الأمان

- جلسات آمنة (HTTP-only cookies)
- تشفير كلمات المرور (bcrypt)
- حماية من الهجمات (Helmet, CORS)
- Rate Limiting

## 📞 الدعم

للمساعدة:
1. اقرأ `WINDOWS_SETUP_GUIDE.md` للتشغيل على Windows
2. اقرأ `RAILWAY_DEPLOY.md` للنشر على Railway
3. اقرأ `FIXES_APPLIED.md` للتفاصيل التقنية

---

**آخر تحديث:** 31 مايو 2026  
**الحالة:** ✅ جاهز للإنتاج