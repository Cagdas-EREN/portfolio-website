import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Content from '../models/Content.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Content.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@cagdas.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Çağdaş',
      role: 'admin'
    });
    console.log('👤 Admin user created');

    // Create sample services
    const services = await Service.insertMany([
      {
        title: 'Bireysel Web Sitesi',
        slug: 'bireysel-web-sitesi',
        shortDescription: 'Modern ve profesyonel kişisel web siteleri',
        description: 'İşletmeniz veya kişisel markanız için özel tasarım, responsive ve SEO uyumlu web siteleri geliştiriyoruz.',
        icon: '🌐',
        features: ['Responsive Tasarım', 'SEO Optimizasyonu', 'Hızlı Yükleme', 'Admin Panel'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        isActive: true,
        order: 1
      },
      {
        title: 'Mini ERP Sistemi',
        slug: 'mini-erp-sistemi',
        shortDescription: 'KOBİ\'ler için özel ERP çözümleri',
        description: 'İşletmenizin ihtiyaçlarına özel stok, satış, finans ve CRM modülleri içeren ERP sistemi.',
        icon: '💼',
        features: ['Stok Yönetimi', 'Satış Takibi', 'Finans Modülü', 'CRM', 'Raporlama'],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        isActive: true,
        order: 2
      },
      {
        title: 'Toplu SMS Gönderimi',
        slug: 'toplu-sms-gonderimi',
        shortDescription: 'Profesyonel SMS pazarlama platformu',
        description: 'Müşterilerinize toplu SMS gönderimi, şablon yönetimi ve raporlama özellikleri.',
        icon: '📱',
        features: ['Toplu Gönderim', 'Şablon Yönetimi', 'Rehber İçe Aktarma', 'Anlık Raporlar', 'API Entegrasyonu'],
        technologies: ['React', 'Node.js', 'Redis', 'SMS API'],
        isActive: true,
        order: 3
      }
    ]);
    console.log('🛠️  Sample services created');

    // Create sample projects
    const projects = await Project.insertMany([
      {
        title: 'E-Ticaret Platformu',
        slug: 'e-ticaret-platformu',
        shortDescription: 'Tam teşekküllü e-ticaret sitesi',
        description: 'Modern tasarım ve güçlü admin paneli ile donatılmış e-ticaret platformu.',
        category: 'web',
        thumbnail: '/uploads/sample-project-1.jpg',
        technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
        features: ['Ürün Yönetimi', 'Sepet Sistemi', 'Ödeme Entegrasyonu', 'Sipariş Takibi'],
        isFeatured: true,
        isActive: true,
        order: 1
      },
      {
        title: 'Muhasebe Yazılımı',
        slug: 'muhasebe-yazilimi',
        shortDescription: 'KOBİ muhasebe takip sistemi',
        description: 'Gelir-gider takibi, fatura yönetimi ve raporlama özellikleri.',
        category: 'erp',
        thumbnail: '/uploads/sample-project-2.jpg',
        technologies: ['React', 'Express', 'PostgreSQL'],
        features: ['Gelir-Gider', 'Fatura Yönetimi', 'Müşteri Takibi', 'Raporlar'],
        isFeatured: true,
        isActive: true,
        order: 2
      }
    ]);
    console.log('📁 Sample projects created');

    // Create content
    await Content.create({
      hero: {
        title: 'Merhaba, Ben Çağdaş',
        subtitle: 'Full Stack Yazılım Geliştirici',
        description: 'Modern web uygulamaları ve işletme yazılımları geliştiriyorum. İşinizi dijitale taşıyalım!',
        cta: 'Projelerime Göz At',
        image: '/uploads/hero-image.jpg'
      },
      about: {
        title: 'Hakkımda',
        description: 'Yazılım geliştirme alanında uzmanlaşmış, modern teknolojileri kullanarak işletmelere özel çözümler üreten bir geliştiriciyim.',
        yearsOfExperience: 5,
        projectsCompleted: 50,
        happyClients: 30
      },
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
      contact: {
        email: 'cagdasseren@gmail.com',
        phone: '+90 543 496 27 78',
        address: 'Üsküdar / İstanbul'
      },
      social: {
        github: 'https://github.com/cagdas',
        linkedin: 'https://linkedin.com/in/cagdas',
        twitter: 'https://twitter.com/cagdas'
      }
    });
    console.log('📝 Content created');

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📧 Admin Login:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
