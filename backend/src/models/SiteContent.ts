import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const siteContentSchema = new mongoose.Schema({
  heroSlides: [slideSchema],
  featuredCategories: [categorySchema]
}, { timestamps: true });

const SiteContent = mongoose.model('SiteContent', siteContentSchema);
export default SiteContent;
