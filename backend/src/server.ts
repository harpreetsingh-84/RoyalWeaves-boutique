import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import User from "./models/User";

dotenv.config();

const app = express();

// middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://royal-weaves-boutique.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// routes
import orderRoutes from "./routes/orderRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import contentRoutes from "./routes/contentRoutes";
import path from "path";

// Expose static multipart binary dumps
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/content", contentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running 🚀");
});

// Seed admin
const seedAdmin = async () => {
  const adminCount = await User.countDocuments({ isAdmin: true });
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'System Admin', email: 'admin@boutique.com', password: hashedPassword, isAdmin: true });
    console.log("Seed: Default Admin Created (email: admin@boutique.com, password: admin123)");
  }
};

// MongoDB connect
mongoose.connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedAdmin();
  })
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});