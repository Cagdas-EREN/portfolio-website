# Çağdaş Portfolio & Admin Panel

Modern, full-stack bireysel portfolyo web sitesi ve admin panel sistemi.

## 🚀 Özellikler

### Public Site
- Modern ve responsive tasarım
- Hizmetler sayfası
- Portfolyo/Projeler galerisi
- Blog sistemi
- İletişim formu
- SEO uyumlu

### Admin Panel
- Güvenli JWT authentication
- Dashboard ve istatistikler
- Hizmet yönetimi (CRUD)
- Proje yönetimi (CRUD)
- Blog yönetimi (CRUD)
- Mesaj/İletişim yönetimi
- Dosya yükleme sistemi
- İçerik yönetimi

## 🛠️ Teknolojiler

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (dosya yükleme)
- Bcrypt (şifreleme)

### Frontend (Public)
- React 18
- Vite
- Tailwind CSS
- React Router
- Framer Motion (animasyonlar)
- Axios

### Admin Panel
- React 18
- Vite
- Tailwind CSS
- React Router
- Context API (state management)

## 📦 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- MongoDB (local veya cloud)
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone <repo-url>
cd Cagdas_Bireysel_Site
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

`.env.example` dosyasını `.env` olarak kopyalayın ve düzenleyin:
```bash
cp .env.example .env
```

`.env` dosyasında gerekli ayarları yapın:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cagdas-portfolio
JWT_SECRET=your-super-secret-key
ADMIN_EMAIL=admin@cagdas.com
ADMIN_PASSWORD=admin123
```

Veritabanını seed edin:
```bash
npm run seed
```

Backend'i başlatın:
```bash
npm run dev
```

### 3. Frontend (Public Site) Kurulumu

Yeni bir terminal açın:
```bash
cd frontend
npm install
npm run dev
```

Site http://localhost:5173 adresinde çalışacak.

### 4. Admin Panel Kurulumu

Yeni bir terminal açın:
```bash
cd admin
npm install
npm run dev
```

Admin panel http://localhost:5174 adresinde çalışacak.

## 🔐 Varsayılan Admin Girişi

```
E-posta: admin@cagdas.com
Şifre: admin123
```

**ÖNEMLİ:** Production ortamında mutlaka şifreyi değiştirin!

## 📁 Proje Yapısı

```
Cagdas_Bireysel_Site/
├── backend/              # Node.js + Express API
│   ├── models/          # MongoDB modelleri
│   ├── routes/          # API route'ları
│   ├── middleware/      # Auth, upload vb.
│   ├── scripts/         # Seed scriptleri
│   └── server.js        # Ana server dosyası
├── frontend/            # Public web sitesi
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   ├── pages/       # Sayfa bileşenleri
│   │   ├── services/    # API servisleri
│   │   └── App.jsx
│   └── package.json
└── admin/               # Admin panel
    ├── src/
    │   ├── components/  # React bileşenleri
    │   ├── pages/       # Admin sayfaları
    │   ├── context/     # Auth context
    │   └── App.jsx
    └── package.json
```

## 🔌 API Endpoints

### Public (Kimlik doğrulama gerekmez)
- `GET /api/services` - Tüm hizmetler
- `GET /api/services/:slug` - Hizmet detayı
- `GET /api/projects` - Tüm projeler
- `GET /api/projects/:slug` - Proje detayı
- `GET /api/blogs` - Blog yazıları
- `GET /api/blogs/:slug` - Blog detayı
- `POST /api/contacts` - İletişim formu gönder
- `GET /api/content` - Site içeriği

### Admin (Kimlik doğrulama gerekir)
- `POST /api/auth/login` - Admin girişi
- `GET /api/auth/me` - Kullanıcı bilgisi
- `GET /api/services/admin/all` - Tüm hizmetler (admin)
- `POST /api/services` - Hizmet ekle
- `PUT /api/services/:id` - Hizmet güncelle
- `DELETE /api/services/:id` - Hizmet sil
- (Projects, Blogs, Contacts için benzer endpoints)

## 🚀 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

### Admin Panel
```bash
cd admin
npm run build
```

## 📝 Özelleştirme

### Renkler ve Tema
`frontend/tailwind.config.js` ve `admin/tailwind.config.js` dosyalarında renk paletini değiştirebilirsiniz.

### İçerik
Admin panelden tüm içerikleri yönetebilirsiniz. İlk kurulumda seed verileri yüklenmiştir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Değişiklikleri commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing`)
5. Pull Request oluşturun

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 👤 İletişim

Çağdaş - [info@cagdas.com](mailto:info@cagdas.com)

## 🎯 Gelecek Özellikler

- [ ] Blog CRUD sayfaları (tam özellikli)
- [ ] Hizmet ve Proje CRUD sayfaları (tam özellikli)
- [ ] Rich text editor (Blog için)
- [ ] Gelişmiş dosya yönetimi
- [ ] E-posta bildirimleri
- [ ] Analitik dashboard
- [ ] SEO meta tag yönetimi
- [ ] Çoklu dil desteği
- [ ] Dark mode

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
