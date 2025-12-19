import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

const app = express();

/**
 * Trust proxy (IMPORTANT for hosted env)
 */
app.set("trust proxy", 1);

/**
 * Middlewares
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

/**
 * HTTP + Socket server
 */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

/**
 * Socket connection
 */
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  /**
   * Join user room
   * Format: user:{id}
   */
  socket.on("join", (room) => {
    if (!room || !room.startsWith("user:")) {
      return;
    }

    socket.join(room);
    console.log(`Socket ${socket.id} joined ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
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
  console.log(`✅ Socket server running on port ${PORT}`);
});
