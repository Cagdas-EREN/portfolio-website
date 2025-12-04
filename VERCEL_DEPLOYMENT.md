# 🚀 Vercel Deployment - Adım Adım Rehber

## Vercel Nedir?
- Frontend için en popüler ücretsiz hosting platformu
- Next.js, React, Vue, Vite gibi frameworkler için optimize
- Otomatik SSL, Global CDN, Lightning fast
- Serverless functions desteği (Backend API için)

---

## 📋 Ön Hazırlık

### 1. GitHub'a Proje Yükle

```bash
# Git repository oluştur (henüz yapmadıysanız)
cd C:\Users\Cagdas\Desktop\Projeler\Cagdas_Bireysel_Site
git init
git add .
git commit -m "Initial commit"

# GitHub'da yeni repo oluştur
# https://github.com/new

# Remote ekle ve push et
git remote add origin https://github.com/KULLANICI_ADINIZ/repo-adi.git
git branch -M main
git push -u origin main
```

### 2. .gitignore Kontrol

```gitignore
# Root .gitignore
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log

# Backend
backend/.env
backend/node_modules/
backend/uploads/*
!backend/uploads/.gitkeep

# Frontend
frontend/.env
frontend/.env.local
frontend/node_modules/
frontend/dist/

# Admin
admin/.env
admin/.env.local
admin/node_modules/
admin/dist/
```

---

## 🎯 Seçenek 1: Vercel Dashboard (En Kolay)

### Frontend Deployment:

#### 1. Vercel'e Git
```
https://vercel.com
Sign up with GitHub
```

#### 2. New Project
- "Add New" → "Project"
- GitHub repository'nizi seçin
- "Import" tıklayın

#### 3. Project Settings

**Framework Preset:** Vite

**Root Directory:** `frontend`

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

#### 4. Environment Variables Ekle

Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.com/api
VITE_BASE_URL=https://your-backend-url.com
```

**NOT:** Backend URL'i henüz yoksa, önce backend'i deploy edin (Render.com)

#### 5. Deploy!
- "Deploy" butonuna tıkla
- 2-3 dakika bekle
- ✅ Site hazır: `https://your-project.vercel.app`

---

### Admin Panel Deployment:

Aynı adımları tekrar et, sadece:

**Root Directory:** `admin`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.com/api
VITE_BASE_URL=https://your-backend-url.com
```

**Deployment URL:** `https://your-admin.vercel.app`

---

## 🎯 Seçenek 2: Vercel CLI (Gelişmiş)

### CLI Kurulumu:

```powershell
# Vercel CLI kur
npm i -g vercel

# Login
vercel login
```

### Frontend Deploy:

```powershell
# Frontend klasörüne git
cd C:\Users\Cagdas\Desktop\Projeler\Cagdas_Bireysel_Site\frontend

# İlk deployment
vercel

# Sorulara cevaplar:
# ? Set up and deploy "frontend"? [Y/n] Y
# ? Which scope? Your Account
# ? Link to existing project? [y/N] N
# ? What's your project's name? cagdas-portfolio-frontend
# ? In which directory is your code located? ./
# ? Want to override settings? [y/N] N
```

#### Environment Variables Ekle:

```powershell
# Production environment variables
vercel env add VITE_API_URL production
# Değer gir: https://your-backend-url.com/api

vercel env add VITE_BASE_URL production
# Değer gir: https://your-backend-url.com
```

#### Production Deploy:

```powershell
vercel --prod
```

### Admin Panel Deploy:

```powershell
# Admin klasörüne git
cd ../admin

# Deploy
vercel

# Project name: cagdas-portfolio-admin

# Environment variables ekle
vercel env add VITE_API_URL production
vercel env add VITE_BASE_URL production

# Production deploy
vercel --prod
```

---

## 🔧 Backend için Vercel Serverless Functions

Vercel backend'i de host edebilir ama limitations var. Önerim Render.com.

### Ama yine de Vercel'de backend:

#### 1. vercel.json oluştur (backend klasöründe):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 2. Deploy:

```powershell
cd backend
vercel

# Environment variables dashboard'dan ekle:
# MONGODB_URI
# JWT_SECRET
# SESSION_SECRET
# FRONTEND_URL
# ADMIN_URL
```

**NOT:** Vercel serverless functions:
- ✅ Kolay deployment
- ❌ 10 saniyelik execution limit
- ❌ File uploads için uygun değil
- ❌ WebSocket desteği yok

**BACKEND İÇİN ÖNERİ:** Render.com kullan (ücretsiz, limitations yok)

---

## 🔗 Backend'i Render.com'a Deploy (Önerilen)

### 1. Render.com'a Git
```
https://render.com
Sign up with GitHub
```

### 2. New Web Service
- "New +" → "Web Service"
- GitHub repo'nuzu bağla
- Repository seç

### 3. Settings:

**Name:** `cagdas-portfolio-backend`

**Root Directory:** `backend`

**Environment:** `Node`

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

### 4. Environment Variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://Admin:Cagdas2756@cagdasbireysel.ch1p6vu.mongodb.net/?retryWrites=true&w=majority&appName=CagdasBireysel
JWT_SECRET=super-secret-jwt-key-change-this-in-production-min-32-chars
SESSION_SECRET=super-secret-session-key-change-this-in-production-min-32-chars
FRONTEND_URL=https://cagdas-portfolio-frontend.vercel.app
ADMIN_URL=https://cagdas-portfolio-admin.vercel.app
```

### 5. Create Web Service

**Backend URL:** `https://cagdas-portfolio-backend.onrender.com`

---

## 🔄 Vercel Frontend'i Backend'e Bağla

### 1. Backend URL'i aldıktan sonra:

```powershell
# Frontend environment variables güncelle
cd frontend
vercel env add VITE_API_URL production
# Değer: https://cagdas-portfolio-backend.onrender.com/api

vercel env add VITE_BASE_URL production
# Değer: https://cagdas-portfolio-backend.onrender.com

# Redeploy
vercel --prod
```

### 2. Admin environment variables:

```powershell
cd ../admin
vercel env add VITE_API_URL production
vercel env add VITE_BASE_URL production
vercel --prod
```

---

## 🌐 Custom Domain Ekleme

### Vercel'de:

1. Project Settings → Domains
2. "Add Domain" → domain.com gir
3. DNS ayarları:

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. 24-48 saat bekle

---

## 📊 Deployment Sonrası

### Test Et:

```
Frontend: https://your-project.vercel.app
Admin: https://your-admin.vercel.app
Backend: https://your-backend.onrender.com/api/health
```

### Logs Kontrol:

**Vercel:**
```powershell
vercel logs
```

**Render:**
- Dashboard → Logs sekmesi

---

## 🔄 Otomatik Deployment (CI/CD)

### Vercel otomatik deploy eder:

1. **Production Branch:** `main`
   - main branch'e push = otomatik production deploy

2. **Preview Deployments:** Diğer branch'ler
   - Her branch otomatik preview URL alır

3. **Pull Request Previews:**
   - Her PR için preview link

### GitHub Actions ile:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🚨 Sorun Giderme

### Build Hatası:

```powershell
# Local test
cd frontend
npm run build

# Hata varsa düzelt, sonra:
git add .
git commit -m "Fix build"
git push
```

### Environment Variables Çalışmıyor:

```powershell
# Redeploy
vercel --prod

# Veya dashboard'dan "Redeploy"
```

### CORS Hatası:

Backend CORS ayarlarını kontrol:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-admin.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
```

### MongoDB Connection Error:

MongoDB Atlas → Network Access:
- IP Whitelist: `0.0.0.0/0` (Allow all)

---

## 💡 Pro Tips

### 1. Preview URLs:

Her commit için preview URL:
```
https://your-project-git-branch-name.vercel.app
```

### 2. Vercel Analytics:

Ücretsiz analytics:
- Dashboard → Analytics → Enable

### 3. Speed Insights:

Performance monitoring:
- Dashboard → Speed Insights → Enable

### 4. Environment Groups:

Farklı environment'lar için:
- Development
- Preview
- Production

### 5. Team Collaboration:

Ücretsiz team hesabı:
- Invite members
- Shared projects

---

## 📦 Deployment Checklist

- [x] GitHub'a push
- [x] .gitignore doğru
- [x] Backend Render'da deploy
- [x] Frontend Vercel'de deploy
- [x] Admin Vercel'de deploy
- [x] Environment variables set
- [x] CORS ayarları doğru
- [x] MongoDB IP whitelist
- [x] Custom domain (opsiyonel)
- [x] SSL sertifikası (otomatik)
- [x] Test et

---

## 🎯 Hızlı Özet

```powershell
# 1. GitHub'a push
git add .
git commit -m "Ready for deployment"
git push

# 2. Vercel CLI kur
npm i -g vercel

# 3. Frontend deploy
cd frontend
vercel
vercel env add VITE_API_URL production
vercel env add VITE_BASE_URL production
vercel --prod

# 4. Admin deploy
cd ../admin
vercel
vercel env add VITE_API_URL production
vercel env add VITE_BASE_URL production
vercel --prod

# 5. Backend Render.com'dan deploy et (dashboard)

# DONE! 🎉
```

---

## 📞 Yardım

**Vercel Docs:** https://vercel.com/docs
**Discord:** https://vercel.com/discord
**Support:** support@vercel.com

---

**SONRAKİ ADIM:** Backend'i Render.com'a deploy et, sonra Vercel frontend/admin'i ona bağla!

Başarılar! 🚀
