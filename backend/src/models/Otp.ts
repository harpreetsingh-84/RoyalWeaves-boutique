import mongoose, { Schema } from 'mongoose';

const otpSchema = new Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  attempts: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // TTL index: document will be automatically deleted after 300 seconds (5 minutes)
  }
});

export default mongoose.model('Otp', otpSchema);
