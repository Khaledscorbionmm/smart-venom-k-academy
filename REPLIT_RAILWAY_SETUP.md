# 🚀 Smart Venom K Academy - Replit + Railway Setup Guide

## مشاكل المشروع الحالية

### ❌ المشاكل الموجودة:
1. **جميع الصفحات (Pages) مفقودة** من `artifacts/academy/src/pages/`
2. **جميع Components مفقودة** من `artifacts/academy/src/components/`
3. **جميع Contexts مفقودة** من `artifacts/academy/src/contexts/`
4. **جميع API Routes مفقودة** من `artifacts/api-server/src/routes/`
5. **Database Config مفقود** من `lib/db/`
6. **UI Components (shadcn) مفقودة**

---

## 📋 الخطوات المطلوبة

### المرحلة 1: إصلاح Contexts (5 ملفات)
```bash
# 1. AuthContext.tsx
# 2. LanguageContext.tsx
# 3. SoundContext.tsx
```

### المرحلة 2: إنشاء UI Components (10+ ملفات)
```bash
# من shadcn/ui:
# - Button
# - Card
# - Input
# - Form
# - Toast
# - Toaster
# - Tooltip
# - Dialog
# - Select
```

### المرحلة 3: إنشاء جميع Pages (10 ملفات)
```bash
# 1. Landing.tsx
# 2. Dashboard.tsx
# 3. Login.tsx
# 4. Register.tsx
# 5. Courses.tsx
# 6. CourseDetail.tsx
# 7. LessonViewer.tsx
# 8. Leaderboard.tsx
# 9. Profile.tsx
# 10. Admin.tsx
# 11. not-found.tsx
```

### المرحلة 4: إنشاء Components (15+ ملف)
```bash
# 1. MainLayout.tsx
# 2. FloatingMascot.tsx
# 3. ErrorBoundary.tsx
# 4. LoadingSkeleton.tsx
# 5. FantasyRankBadge.tsx
# ... و أكثر
```

### المرحلة 5: إنشاء API Routes (8 ملفات)
```bash
# 1. routes/index.ts
# 2. routes/auth.ts
# 3. routes/users.ts
# 4. routes/courses.ts
# 5. routes/lessons.ts
# 6. routes/quizzes.ts
# 7. routes/leaderboard.ts
# 8. routes/admin.ts
```

### المرحلة 6: إنشاء Database Config
```bash
# 1. lib/db/index.ts
# 2. lib/db/schema.ts
# 3. lib/db/migrations.ts
```

---

## 🔧 Prompt للاستخدام في Claude/ChatGPT

انسخ هذا الـ Prompt وألصقه في Replit Console أو استخدمه مع Claude:

```
أنت مهندس برمجيات متخصص في React + Express + TypeScript.

مشروعي "Smart Venom K Academy" يحتوي على الآتي:

**الهيكل الموجود:**
- ✅ App.tsx موجود (لكن يستورد ملفات مفقودة)
- ✅ Vite config موجود
- ✅ TypeScript config موجود
- ✅ Dependencies موجودة في package.json

**المشاكل الرئيسية:**
1. جميع الصفحات مفقودة من `artifacts/academy/src/pages/`
2. جميع Components مفقودة من `artifacts/academy/src/components/`
3. جميع Contexts مفقودة من `artifacts/academy/src/contexts/`
4. جميع API Routes مفقودة من `artifacts/api-server/src/routes/`
5. Database config مفقود من `lib/db/`
6. shadcn UI components مفقودة

**المتطلبات:**
- Platform: Bilingual (Arabic RTL + English)
- Theme: Dark (deep navy/purple)
- Features: XP system, Leaderboard, Code Editor (Monaco), Quizzes
- Auth: Email/Password + Session-based (PostgreSQL)
- 7 Programming Languages (Python, JavaScript, TypeScript, Java, C++, Rust, Go)
- Admin Dashboard for managing courses

**الخطوات المطلوبة:**

1. **أنشئ Contexts (artifacts/academy/src/contexts/):**
   - AuthContext.tsx (user state, login/logout)
   - LanguageContext.tsx (ar/en toggle)
   - SoundContext.tsx (audio effects)

2. **أنشئ shadcn UI Components (artifacts/academy/src/components/ui/):**
   - button.tsx
   - card.tsx
   - input.tsx
   - form.tsx
   - toast.tsx, toaster.tsx
   - tooltip.tsx
   - dialog.tsx
   - select.tsx

3. **أنشئ Custom Components (artifacts/academy/src/components/):**
   - MainLayout.tsx
   - FloatingMascot.tsx
   - ErrorBoundary.tsx
   - LoadingSkeleton.tsx
   - FantasyRankBadge.tsx
   - Header.tsx
   - Sidebar.tsx
   - CodeEditor.tsx (Monaco integration)
   - QuizComponent.tsx

4. **أنشئ Pages (artifacts/academy/src/pages/):**
   - Landing.tsx (hero section)
   - Dashboard.tsx (user dashboard)
   - Login.tsx (login form)
   - Register.tsx (registration)
   - Courses.tsx (courses catalog)
   - CourseDetail.tsx (single course)
   - LessonViewer.tsx (with Monaco editor + quiz)
   - Leaderboard.tsx (top users)
   - Profile.tsx (user profile)
   - Admin.tsx (admin dashboard)
   - not-found.tsx (404 page)

5. **أنشئ Hooks (artifacts/academy/src/hooks/):**
   - useAuth.ts
   - useFetch.ts
   - useLocalStorage.ts
   - useSound.ts
   - useLanguage.ts

6. **أنشئ Lib Utilities (artifacts/academy/src/lib/):**
   - api.ts (API client)
   - utils.ts (helpers)
   - fantasyRanks.ts (rank system)
   - achievements.ts (achievements data)
   - languages.ts (programming languages config)

7. **أنشئ API Routes (artifacts/api-server/src/routes/):**
   - index.ts (main router)
   - auth.ts (login, register, logout)
   - users.ts (get/update profile)
   - courses.ts (get courses)
   - lessons.ts (get lessons, submit answers)
   - quizzes.ts (quiz endpoints)
   - leaderboard.ts (top users)
   - admin.ts (admin endpoints)

8. **أنشئ API Lib (artifacts/api-server/src/lib/):**
   - logger.ts (Pino logger)
   - errors.ts (error handling)
   - validators.ts (input validation)

9. **أنشئ Middleware (artifacts/api-server/src/middlewares/):**
   - auth.ts (session check)
   - adminCheck.ts (admin role check)
   - errorHandler.ts (error handling)

10. **أنشئ Database Config (lib/db/):**
    - index.ts (pool connection)
    - schema.ts (Drizzle ORM schema)
    - migrations.ts (initial migration)

**ملاحظات هامة:**
- استخدم Drizzle ORM للـ database
- استخدم Zod للـ validation
- استخدم Wouter للـ routing
- استخدم shadcn/ui للـ components
- اتبع pattern: TS strict mode
- اجعل جميع الملفات متوافقة مع Monorepo structure
- استخدم Arabic-first approach مع English fallback
- Dark theme كـ default

**الأولويات:**
1. أولاً: Contexts + Utils
2. ثانياً: UI Components
3. ثالثاً: Pages الأساسية (Landing, Login, Register)
4. رابعاً: بقية Pages
5. خامساً: API Routes
6. سادساً: Database

ابدأ بإنشاء الملفات بالترتيب وتأكد من عدم وجود أي import errors.
```

---

## 🚀 ربط Railway مع Replit

### الخطوة 1: الإعداد في Railway

```bash
# 1. اذهب إلى https://railway.app
# 2. سجل الدخول أو أنشئ حساب
# 3. اختر "Create New Project"
# 4. اختر "Deploy from GitHub"
# 5. ربط repository: Khaledscorbionmm/smart-venom-k-academy
```

### الخطوة 2: ضبط Environment Variables في Railway

```bash
# في Railway Dashboard، اذهب إلى "Variables" وأضف:

# Database
DATABASE_URL=postgresql://user:password@host:5432/smart_venom_k

# Security
SESSION_SECRET=your-super-secret-key-here-min-32-chars

# Environment
NODE_ENV=production
PORT=8080

# Optional
LOG_LEVEL=info
CORS_ORIGIN=https://your-railway-domain.railway.app
```

### الخطوة 3: ربط Replit مع Railway

**في Replit:**
```bash
# 1. فتح Replit Shell
# 2. أضف Railway CLI

npm install -g @railway/cli

# 3. سجل الدخول لـ Railway
railway login

# 4. ربط المشروع الحالي
railway link

# 5. انظر للـ logs
railway logs
```

### الخطوة 4: Deploy

**الخيار 1: من Railway (الأفضل)**
```
- Railway سيقرأ Dockerfile تلقائياً
- سيبني image ويشغله
```

**الخيار 2: من Replit**
```bash
# في Replit Shell
railway up
```

---

## 🔗 Dockerfile (موجود بالفعل)

```dockerfile
FROM node:22-slim AS builder
WORKDIR /app

RUN npm install -g pnpm@10.26.1

COPY . .

RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));delete p.scripts.preinstall;fs.writeFileSync('package.json',JSON.stringify(p,null,2));"

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/academy run build
RUN pnpm --filter @workspace/api-server run build

FROM node:22-alpine AS production
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/academy/dist/public ./artifacts/academy/dist/public

RUN mkdir -p uploads/videos

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/api/healthz || exit 1

CMD ["node", "artifacts/api-server/dist/index.mjs"]
```

---

## 📝 Command Summary

### في Replit:

```bash
# 1. تثبيت Dependencies
pnpm install

# 2. Build
pnpm build

# 3. تشغيل محلياً
pnpm dev

# 4. إرسال إلى Railway
git add .
git commit -m "feat: add missing components, pages, and routes"
git push origin main
```

### في Terminal المحلي أو Replit:

```bash
# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# ربط المشروع
railway link

# عرض logs
railway logs

# وقف التطبيق
railway down
```

---

## ✅ Checklist

- [ ] أنشئ جميع Contexts
- [ ] أنشئ جميع UI Components (shadcn)
- [ ] أنشئ جميع Custom Components
- [ ] أنشئ جميع Pages
- [ ] أنشئ جميع API Routes
- [ ] أنشئ Database Config
- [ ] تم حل جميع TypeScript Errors
- [ ] تم Build بدون أخطاء محلياً
- [ ] تم ربط Railway
- [ ] تم Deploy على Railway بنجاح

---

## 🔗 الروابط المهمة

- **Railway Dashboard**: https://railway.app/dashboard
- **Repository**: https://github.com/Khaledscorbionmm/smart-venom-k-academy
- **Replit**: https://replit.com/@Khaledscorbionmm
- **API Server Health**: `https://your-railway-domain.railway.app/api/healthz`

---

## 🎯 Next Steps

1. استخدم الـ Prompt أعلاه في Claude أو ChatGPT
2. اطلب منهم إنشاء جميع الملفات المفقودة
3. انسخ الملفات إلى Replit
4. شغل `pnpm install` ثم `pnpm build`
5. اختبر محلياً مع `pnpm dev`
6. أرسل إلى Railway

---

## ⚠️ ملاحظات هامة

- **تأكد أن جميع الاستيرادات صحيحة** قبل البناء
- **استخدم TypeScript strict mode** للتحقق من الأخطاء
- **اختبر API endpoints** قبل الإطلاق
- **تأكد من متغيرات البيئة** (DATABASE_URL, SESSION_SECRET)
- **راجع Railway logs** عند حدوث مشاكل

---

**Good luck! 🚀**
