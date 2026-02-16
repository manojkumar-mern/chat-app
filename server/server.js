import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";

import socketHandler from "./socket/socketHandler.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);
app.use("/api", messageRoutes);

// ⭐ Stable start function (no DNS changes)
const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/chatapp", // 👈 keep your OLD WORKING URI here
      // or your previous working atlas/local connection
    );

    console.log("✅ MongoDB connected");

    // IMPORTANT: allow mobile access on same WiFi
    server.listen(5000, "0.0.0.0", () => {
      console.log("🚀 Server running on port 5000");
    });
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
  }
};

startServer();
