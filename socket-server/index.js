import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join", (room) => {
    socket.join(room);
  });
});

app.post("/emit", (req, res) => {
  const { room, event, data } = req.body;
  io.to(room).emit(event, data);
  res.json({ success: true });
});

server.listen(3001, () => console.log("Socket server running on port 3001"));
