# ربط المشروع بـ Railway

دليل استضافة المشروع على Railway باستخدام Docker

## الخطوات السريعة

### 1. تفعيل الربط بين Railway وـ GitHub
- ادخل Railway Dashboard
- اضغط New Project → Deploy from GitHub repo
- اختر: `Khaledscorbionmm/smart-venom-k-academy`

### 2. اضافة قاعدة بيانات PostgreSQL
- في Dashboard: New → Database → Add PostgreSQL
- Railway سيعطيك `DATABASE_URL` جاهز تلقائيًا

### 3. إضافة متغيرات البيئة (Variables)
انتقل لـ Variables → New Variable:
```
SESSION_SECRET = اب_أي_متغير_عشوائي_32_حرف_أو_أكثر
NODE_ENV = production
PORT = 8080
```

### 4. ضبط إعدادات البناء
في إعدادات السيرفيس (Settings):
- **Builder**: اختر `Dockerfile` (ليس Railpack)
- **Deploy**: سيب الفراغ فاضية (الفاراس يحدده `railway.json`)

### 5. نشر (اضغط Deploy)
اضغط Deploy → Railway سيبني المشروع آتوماتيكيًا!

### 6. ربط الدومين
- إعدادات → Networking → Generate Domain
- أو Custom Domain لو عندك دومين

## ملفات التهيئة

| الملف | الوظيفة |
|---------|----------|
| `railway.json` | اعدادات Railway (نموذج رسمي) |
| `railway.toml` | اعدادات Railway (بصيغة TOML) |
| `railway.yaml` | اعدادات Railway (بصيغة YAML) |
| `Dockerfile` | تصميم البرنامج بـ Docker |
| `docker-compose.yml` | للتشغيل المحلي (للتطوير والتجربة) |
| `.railwayignore` | ملفات مستثنى من الرفع |

## ملاحظات هامة

1. المشروع يستخدم **Dockerfile** لبناء الصورة النهائية
2. ربط PostgreSQL هو المسؤول عن قاعدة البيانات الأساسية
3. الفيديوهات متصالة مجانياً من خلال عنوان `uploads/videos/`

## الدعم والترويج
المشروع شغال حالياً على Replit:
- **الرابط**: https://arabian-smart-venom.replit.app
- **GitHub**: https://github.com/Khaledscorbionmm/smart-venom-k-academy
