import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Rich text HTML
  image: { type: String }, // Optional image
  icon: { type: String }, // Optional lucide icon name
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  sections: [sectionSchema]
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);
export default Page;
