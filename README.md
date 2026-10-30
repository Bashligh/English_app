# سامانه آموزشی زبان

نسخه‌ی بدون Vite و بدون build system.

## اجرا

برای توسعه محلی، از یک web server ساده استفاده کنید:

```bash
cd english-learning
python3 -m http.server 8000
```

سپس:

`http://localhost:8000`

## ساختار

- `index.html` — shell اصلی
- `css/` — استایل‌ها
- `js/` — منطق برنامه و components
- `data/` — محتوای درس، لغات و آزمون
- `audio/` — محل فایل‌های صوتی محلی
- `assets/` — تصاویر و assetهای دیگر

## نکته درباره audio

فعلاً URLهای صوتی فعلی پروژه داخل JSON نگه داشته شده‌اند تا پروژه بلافاصله کار کند.

برای انتقال به فایل محلی، مثلاً:

```json
"audio": "./audio/lesson-005/part-a.m4a"
```

و فایل را در همان مسیر قرار دهید.

## کتابخانه‌ها

- Lucide از CDN برای iconها
- GSAP از CDN برای animationهای اصلی

هیچ build step یا package manager لازم نیست.
