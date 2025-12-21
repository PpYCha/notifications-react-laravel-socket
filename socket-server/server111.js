import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

const app = express();

/**
 * Trust proxy (IMPORTANT for hosted env like Hostinger)
 */
app.set("trust proxy", 1);

/**
 * Allowed frontend origin
 * Example:
 * https://notify-testing.northern-samar.com
 */
const FRONTEND_URL = process.env.FRONTEND_URL;

/**
 * Middlewares
 */
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Socket-Key"],
    credentials: true,
  })
);

app.use(express.json());

/**
 * Health check / index route
 */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "socket-server",
    timestamp: new Date().toISOString(),
  });
});

/**
 * HTTP + Socket server
 */
const server = http.createServer(app);

/**
 * Socket.IO instance
 */
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // safe for Hostinger
});

/**
 * Socket connection
 */
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  /**
   * Join user room
   * Format: user:{id}
   */
  socket.on("join", (room) => {
    if (!room || !room.startsWith("user:")) {
      console.warn("❌ Invalid room:", room);
      return;
    }

    socket.join(room);
    console.log(`✅ Socket ${socket.id} joined ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("❎ Client disconnected:", socket.id);
  });
});

/**
 * Secure emit endpoint (Laravel → Socket)
 */
app.post("/emit", (req, res) => {
  const apiKey = req.headers["x-socket-key"];

  if (apiKey !== process.env.SOCKET_EMIT_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { room, event, data } = req.body;

  if (!room || !event) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  io.to(room).emit(event, data);

  return res.json({ success: true });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Socket server running on port ${PORT}`);
});
