import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true }
});

const collectionItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }
});

const howItWorksSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  num: { type: String, required: true }
});

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true }
});

const siteContentSchema = new mongoose.Schema({
  heroSlides: [slideSchema],
  featuredCategories: [collectionItemSchema],
  features: [featureSchema],
  howItWorks: [howItWorksSchema],
  testimonials: [testimonialSchema],
  upiId: { type: String, default: '8824656153@axl' },
  upiQrCode: { type: String, default: '' },
  contactEmail: { type: String, default: 'support@wovenwonder.com' },
  contactPhone: { type: String, default: '+1 (555) 123-4567' },
  contactAddress: { type: String, default: '123 Fashion Avenue, Suite 400, New York, NY 10018\nUnited States' },
  storeHours: { type: String, default: 'Monday - Friday: 9AM - 6PM EST\nSaturday: 10AM - 4PM EST\nSunday: Closed' }
}, { timestamps: true });

const SiteContent = mongoose.model('SiteContent', siteContentSchema);
export default SiteContent;
