# 🚀 Deployment Guide - Ücretsiz Hosting

## Seçenek 1: Railway (ÖNERİLEN - Full Stack)

### Avantajlar:
- ✅ Backend + Frontend + Admin hepsi tek yerde
- ✅ MongoDB Atlas ile kolay entegrasyon
- ✅ Otomatik SSL
- ✅ Kolay environment variables
- ✅ Ücretsiz $5 credit/ay (yeterli olur)

### Adım Adım Railway Deployment:

#### 1. Railway Hesabı Oluştur
```
https://railway.app
GitHub ile sign up yap
```

#### 2. Backend Deploy

```bash
# Railway CLI kur
npm i -g @railway/cli

# Backend klasörüne git
cd backend

# Railway project oluştur
railway login
railway init

# Environment variables ekle (Railway dashboard'dan)
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://Admin:Cagdas2756@cagdasbireysel.ch1p6vu.mongodb.net/?retryWrites=true&w=majority&appName=CagdasBireysel
JWT_SECRET=<güçlü-rastgele-32-karakter-string>
SESSION_SECRET=<güçlü-rastgele-32-karakter-string>
FRONTEND_URL=https://yourfrontend.up.railway.app
ADMIN_URL=https://youradmin.up.railway.app

# Deploy
railway up
```

#### 3. Frontend Deploy

```bash
# Frontend klasörüne git
cd ../frontend

# Railway project oluştur
railway init

# Environment variables ekle
VITE_API_URL=https://yourbackend.up.railway.app/api
VITE_BASE_URL=https://yourbackend.up.railway.app

# Deploy
railway up
```

#### 4. Admin Panel Deploy

```bash
# Admin klasörüne git
cd ../admin

# Railway project oluştur
railway init

# Environment variables ekle
VITE_API_URL=https://yourbackend.up.railway.app/api
VITE_BASE_URL=https://yourbackend.up.railway.app

# Deploy
railway up
```

#### 5. Custom Domain Bağla (Opsiyonel)
Railway dashboard'dan:
- Settings → Domains → Add Custom Domain
- DNS kayıtlarını ekle (A record veya CNAME)

---

## Seçenek 2: Vercel + Render

### Backend → Render.com
### Frontend + Admin → Vercel

#### Render.com (Backend):

1. **Render.com'a Git**
   ```
   https://render.com
   GitHub ile sign up
   ```

2. **New Web Service Oluştur**
   - GitHub repo'nuzu bağla
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start` veya `node server.js`

3. **Environment Variables Ekle:**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret>
   SESSION_SECRET=<your-secret>
   FRONTEND_URL=https://yoursite.vercel.app
   ADMIN_URL=https://youradmin.vercel.app
   ```

#### Vercel (Frontend):

```bash
# Vercel CLI kur
npm i -g vercel

# Frontend deploy
cd frontend
vercel

# Environment variables ekle (Vercel dashboard'dan):
VITE_API_URL=https://yourbackend.onrender.com/api
VITE_BASE_URL=https://yourbackend.onrender.com

# Production deploy
vercel --prod
```

#### Vercel (Admin):

```bash
cd admin
vercel

# Environment variables:
VITE_API_URL=https://yourbackend.onrender.com/api
VITE_BASE_URL=https://yourbackend.onrender.com

vercel --prod
```

---

## Seçenek 3: Netlify + Render

### Backend → Render
### Frontend + Admin → Netlify

#### Netlify Deploy:

```bash
# Netlify CLI kur
npm i -g netlify-cli

# Frontend build
cd frontend
npm run build

# Deploy
netlify deploy --prod

# Environment variables Netlify dashboard'dan ekle
```

**netlify.toml** oluştur:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Seçenek 4: Fly.io (Advanced)

```bash
# Fly CLI kur
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Backend deploy
cd backend
fly launch

# Frontend deploy
cd ../frontend
npm run build
fly launch --image nginx

# Admin deploy
cd ../admin
npm run build
fly launch --image nginx
```

---

## 📋 Deployment Öncesi Checklist

### Backend:

1. **package.json'a ekle:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

2. **server.js port config:**
```javascript
const PORT = process.env.PORT || 5000;
```

3. **CORS config güncelle:**
```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
```

### Frontend & Admin:

1. **Vite config ekle** (`vite.config.js`):
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 5173
  }
})
```

2. **Environment variables:**
- Production URL'leri kullan
- API endpoint'lerini güncelle

### MongoDB Atlas:

1. **Network Access:**
   - IP Whitelist'e `0.0.0.0/0` ekle (tüm IP'lere izin)
   - Veya hosting provider'ın IP'sini ekle

2. **Database User:**
   - Read/Write yetkisi var mı kontrol et

---

## 🔧 Post-Deployment

### SSL Sertifikası
- Railway, Vercel, Netlify, Render hepsi otomatik SSL veriyor
- Custom domain için DNS ayarlarını yap

### Monitoring
```bash
# Railway
railway logs

# Render
# Dashboard'dan logs görülebilir

# Vercel
vercel logs
```

### Database Backup
```bash
# MongoDB Atlas'tan otomatik backup aktif et
# Settings → Backup → Enable
```

---

## 💰 Maliyet Karşılaştırması

| Platform | Backend | Frontend | Admin | Toplam/Ay |
|----------|---------|----------|-------|-----------|
| Railway | $5 credit | Dahil | Dahil | $0 (credit yeter) |
| Vercel + Render | $0 | $0 | $0 | $0 |
| Netlify + Render | $0 | $0 | $0 | $0 |
| Fly.io | $0 | $0 | $0 | $0 (limit içinde) |

---

## 🎯 Hangi Platformu Seçmeliyim?

### Railway seç eğer:
- ✅ Her şeyi tek yerden yönetmek istiyorsan
- ✅ Kolay deployment istiyorsan
- ✅ MongoDB Atlas kullanıyorsan

### Vercel + Render seç eğer:
- ✅ Frontend performansı öncelikse
- ✅ Global CDN istiyorsan
- ✅ Serverless architecture seviyorsan

### Netlify + Render seç eğer:
- ✅ Netlify'ın form ve function özelliklerini kullanacaksan
- ✅ JAMstack yapısı seviyorsan

---

## 🚨 Önemli Notlar

1. **Free Tier Limitations:**
   - Render free tier: 750 saat/ay, 15 dk sonra sleep
   - Railway: $5 credit/ay (genelde yeter)
   - Vercel: 100GB bandwidth/ay
   - Netlify: 100GB bandwidth/ay

2. **Custom Domain:**
   - Hepsi custom domain destekliyor
   - DNS ayarları 24-48 saat sürebilir

3. **Environment Variables:**
   - Asla .env dosyasını commit etme
   - Her platform'da ayrı ayrı ayarla

4. **Build Times:**
   - Railway: En hızlı
   - Vercel: Çok hızlı
   - Render: Biraz yavaş (free tier)

---

## 📞 Deployment Sonrası Test

```bash
# Backend health check
curl https://yourbackend.up.railway.app/api/health

# Frontend
https://yourfrontend.up.railway.app

# Admin
https://youradmin.up.railway.app/admin
```

---

## 🔄 CI/CD (Otomatik Deployment)

Hepsi Git push ile otomatik deploy ediyor:

1. GitHub/GitLab'a push et
2. Platform otomatik build ve deploy eder
3. Her commit'te yeni version

---

**ÖNERİM:** Railway ile başla, çünkü:
- En kolay setup
- Full stack tek yerde
- Ücretsiz tier yeterli
- MongoDB Atlas ile perfect uyum

Başarılar! 🚀
