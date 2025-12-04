# Güvenlik Önlemleri ve Canlıya Alma Kontrol Listesi

## ✅ Uygulanan Güvenlik Önlemleri

### 1. Rate Limiting (Hız Sınırlama)
- ✅ Genel API istekleri: 15 dakikada 100 istek
- ✅ Login endpoint: 15 dakikada 5 deneme
- ✅ Brute force saldırılarına karşı koruma

### 2. Güvenlik Header'ları (Helmet)
- ✅ Content Security Policy (CSP)
- ✅ XSS koruması
- ✅ Clickjacking koruması
- ✅ MIME type sniffing koruması

### 3. CORS Yapılandırması
- ✅ Sadece belirlenen origin'lere izin
- ✅ Credentials desteği
- ✅ Belirli HTTP metodlarına izin

### 4. Input Sanitization
- ✅ NoSQL injection koruması (mongo-sanitize)
- ✅ Parameter pollution koruması
- ✅ Request body size limiti (10MB)

### 5. Session Yönetimi
- ✅ Güvenli cookie ayarları
- ✅ HttpOnly flag (XSS koruması)
- ✅ SameSite flag (CSRF koruması)
- ✅ Production'da HTTPS zorunluluğu
- ✅ 24 saatlik session timeout

### 6. Authentication & Authorization
- ✅ JWT token ile kimlik doğrulama
- ✅ Token expiration (7 gün)
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control (admin)
- ✅ Login attempt logging
- ✅ Last login tracking

### 7. File Upload Security
- ✅ Dosya tipi kontrolü (sadece resimler)
- ✅ Dosya boyutu limiti (5MB)
- ✅ Güvenli dosya isimlendirme

### 8. Logging & Monitoring
- ✅ Request logging (IP, method, URL)
- ✅ Failed login attempt logging
- ✅ Successful login logging
- ✅ Logout logging

### 9. IP-Based Access Control
- ✅ IP blacklist sistemi
- ✅ Şüpheli IP'leri engelleme

---

## 🚀 Canlıya Alma Öncesi Yapılacaklar

### 1. Environment Variables (.env)
```bash
# ÖNEMLİ: Production'da mutlaka değiştirin!
NODE_ENV=production
JWT_SECRET=<güçlü-rastgele-string-en-az-32-karakter>
SESSION_SECRET=<güçlü-rastgele-string-en-az-32-karakter>

# Frontend ve Admin URL'lerini güncelleyin
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com

# MongoDB URI'ı production database'e yönlendirin
MONGODB_URI=mongodb+srv://...
```

### 2. SSL/TLS Sertifikası
- [ ] Domain için SSL sertifikası edinin (Let's Encrypt ücretsiz)
- [ ] HTTPS'i zorunlu kılın
- [ ] HTTP'den HTTPS'e yönlendirme ekleyin

### 3. Firewall Yapılandırması
- [ ] Sadece gerekli portları açın (80, 443, 5000)
- [ ] SSH portunu değiştirin (22 yerine custom port)
- [ ] Fail2ban veya benzeri brute force koruması ekleyin

### 4. Database Güvenliği
- [ ] MongoDB Atlas Network Access ayarlarını kontrol edin
- [ ] Sadece server IP'sine erişim verin
- [ ] Database backup stratejisi oluşturun
- [ ] MongoDB user'ın minimal yetkilerle çalıştığından emin olun

### 5. Server Yapılandırması
- [ ] PM2 veya benzeri process manager kullanın
- [ ] Nginx reverse proxy kurun
- [ ] Static dosyalar için CDN kullanmayı düşünün
- [ ] Log rotation ayarlayın

### 6. Kod Güvenliği
- [ ] Tüm dependency'leri güncelleyin: `npm audit fix`
- [ ] .env dosyasının .gitignore'da olduğundan emin olun
- [ ] API key'leri ve secret'ları asla commit etmeyin
- [ ] Error mesajlarında hassas bilgi paylaşmayın

### 7. Monitoring & Alerts
- [ ] Error tracking (Sentry vb.) ekleyin
- [ ] Uptime monitoring (UptimeRobot vb.) kurun
- [ ] Performance monitoring (New Relic, Datadog vb.)
- [ ] Log aggregation (ELK Stack, Papertrail vb.)

### 8. Backup Stratejisi
- [ ] Günlük MongoDB backup
- [ ] Upload klasörü backup
- [ ] Backup'ların farklı lokasyonda saklanması
- [ ] Restore prosedürünü test edin

### 9. Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide
- [ ] Incident response plan
- [ ] Recovery procedures

### 10. Testing
- [ ] Security testing (OWASP Top 10)
- [ ] Load testing
- [ ] Penetration testing
- [ ] SSL Labs test (A+ rating hedefleyin)

---

## 📋 Canlıya Alma Komutları

### Backend Deploy (PM2 ile)
```bash
# Production mode'da çalıştır
NODE_ENV=production pm2 start server.js --name "portfolio-backend"

# Auto-restart ve log management
pm2 startup
pm2 save

# Logs
pm2 logs portfolio-backend
```

### Nginx Yapılandırması
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

---

## 🔒 Güvenlik Best Practices

1. **Şifre Politikası**
   - Minimum 8 karakter
   - Büyük/küçük harf, rakam, özel karakter
   - Düzenli şifre değişimi

2. **2FA (Two-Factor Authentication)**
   - Gelecekte eklenebilir
   - Google Authenticator veya SMS

3. **API Rate Limiting**
   - Endpoint bazında ayarlanabilir
   - IP bazında takip

4. **Security Headers**
   - HSTS header ekleyin
   - CSP policy'yi sıkılaştırın

5. **Dependency Management**
   - `npm audit` düzenli çalıştırın
   - Outdated package'ları güncelleyin
   - Security advisories takip edin

---

## 📞 Acil Durum İletişim

Güvenlik açığı tespit edilirse:
1. Hemen servisi durdurun
2. Logları inceleyin
3. Etkilenen sistemleri izole edin
4. Patch uygulayın
5. Kullanıcıları bilgilendirin

---

## ✨ Ek Öneriler

### Redis Session Store
```bash
npm install connect-redis redis
```

### HTTPS Redirect Middleware
```javascript
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

### Health Check Endpoint
```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

---

**Son Kontrol:** Tüm bu adımları tamamladıktan sonra projeniz canlıya alınmaya hazır! 🚀
