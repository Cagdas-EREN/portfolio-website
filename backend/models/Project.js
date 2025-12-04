import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'desktop', 'erp', 'automation', 'other']
  },
  images: [{
    url: String,
    caption: String
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  technologies: [{
    type: String
  }],
  features: [{
    type: String
  }],
  client: {
    type: String,
    default: ''
  },
  completedDate: {
    type: Date
  },
  projectUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);
