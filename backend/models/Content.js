import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  hero: {
    title: String,
    subtitle: String,
    description: String,
    cta: String,
    image: String
  },
  about: {
    title: String,
    description: String,
    yearsOfExperience: Number,
    projectsCompleted: Number,
    happyClients: Number
  },
  skills: [String],
  contact: {
    email: String,
    phone: String,
    address: String
  },
  social: {
    github: String,
    linkedin: String,
    twitter: String,
    facebook: String
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

export default mongoose.model('Content', contentSchema);
