import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
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
  icon: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  pricing: {
    startingPrice: {
      type: Number,
      default: 0
    },
    pricingType: {
      type: String,
      enum: ['fixed', 'hourly', 'project', 'custom'],
      default: 'custom'
    },
    currency: {
      type: String,
      default: 'TRY'
    }
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

export default mongoose.model('Service', serviceSchema);
