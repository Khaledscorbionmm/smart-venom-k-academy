# 🪟 دليل التشغيل على Windows

## المشاكل التي تم حلها

### 1. مشكلة preinstall script
- **المشكلة**: السكربت كان يستخدم `sh -c` وهو غير متوفر في Windows
- **الحل**: تم إزالة السكربت من `package.json` لأنه كان يسبب مشاكل في البيئة المحلية

### 2. مشكلة esbuild على Windows
- **المشكلة**: esbuild كان مستبعدًا لـ win32-x64 في `pnpm-workspace.yaml`
- **الحل**: تم إزالة الاستبعاد لـ `esbuild>@esbuild/win32-x64`

### 3. مشكلة rollup على Windows
- **المشكلة**: rollup كان مستبعدًا لـ win32-x64-msvc في `pnpm-workspace.yaml`
- **الحل**: تم إزالة الاستبعاد لـ `rollup>@rollup/rollup-win32-x64-msvc`

### 4. مشكلة allowBuilds
- **المشكلة**: قيمة `allowBuilds.esbuild` كانت نص غير صالح
- **الحل**: تم تعيينها إلى `true`

## خطوات التشغيل على Windows

### 1. تثبيت dependencies
```bash
cd smart-venom-k-academy
pnpm install
```

### 2. تشغيل Development Server
```bash
# تشغيل frontend فقط
cd artifacts/academy
pnpm run dev

# أو تشغيل كل المشروع
cd smart-venom-k-academy
pnpm run build
```

### 3. البناء للإنتاج
```bash
cd smart-venom-k-academy
pnpm run build
```

## ملاحظات مهمة

1. **استخدم pnpm دائمًا**: المشروع مكون ليستخدم pnpm، لا تستخدم npm أو yarn
2. **Windows فقط**: الإصلاحات أعلاه خاصة بـ Windows، على Linux/Mac قد لا تحتاج إليها
3. **قاعدة البيانات**: تحتاج إلى PostgreSQL قاعدة بيانات للعمل
4. **المنفذ**: Frontend يعمل على المنفذ 18540 بشكل افتراضي

## المتغيرات البيئية المطلوبة

للتشغيل المحلي:
- `DATABASE_URL`: رابط قاعدة بيانات PostgreSQL
- `SESSION_SECRET`: سر الجلسة (للتطوير: "dev-secret")
- `NODE_ENV`: development أو production
- `PORT`: منفذ الخادم (8080 للـ API)

## النشر على Railway

المشروع جاهز للنشر على Railway باستخدام Docker. راجع `RAILWAY_DEPLOY.md` للتفاصيل.

---

**تاريخ التحديث:** 31 مايو 2026
**الحالة:** ✅ جاهز للتشغيل على Windows