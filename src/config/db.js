import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(env.mongoUri);
    isConnected = true;
    console.log(`✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠ MongoDB disconnected");
    isConnected = false;
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err.message);
  });
}
