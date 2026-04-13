const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // later we will restrict to frontend URL
  },
});

// When a user connects
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Notification service is running 🚀");
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});