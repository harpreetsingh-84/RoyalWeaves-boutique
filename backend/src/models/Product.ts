import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  gallery: string[];
  quantity: number;
  colors?: { color: string; stock: number; image?: string }[];
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  gallery: [{ type: String }],
  quantity: { type: Number, required: true, default: 0, min: 0 },
  colors: [{
    color: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    image: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', productSchema);
