import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }
});

export default mongoose.model('User', userSchema);
