const http = require('http');
const express = require('express');
const cors = require("cors");
require("dotenv").config();
const mongoose = require('mongoose');
const { Server } = require("socket.io");

// Import routes
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

// Import middleware + socket handlers
const verifySocketJWT = require("./middleware/verifySocketJWT");
const socketHandlers = require("./sockets/handlers");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// DB Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chat-app";

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("🔥 MongoDB connected");

  // Initialize socket.io
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // JWT auth for sockets
  io.use(verifySocketJWT);

  io.on("connection", (socket) => {

    // 👇 Extract userId from the decoded token
    const userId = socket.user.id;

    // 👇 Pass userId to handlers
    socketHandlers(io, socket, userId);
  });

  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

