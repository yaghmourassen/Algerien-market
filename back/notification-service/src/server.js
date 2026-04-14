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
    origin: "*",
  },
});

// =======================
// 🧠 IN-MEMORY CART DB
// =======================
let cart = {};
// format: { userId: [ { productId, quantity } ] }

// =======================
// 🔌 SOCKET CONNECTION
// =======================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// =======================
// 🧪 TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("Notification service + Cart service is running 🚀");
});

// =======================
// ➕ ADD TO CART
// =======================
app.post("/api/cart/add", (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing data" });
  }

  if (!cart[userId]) {
    cart[userId] = [];
  }

  const existingItem = cart[userId].find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart[userId].push({ productId, quantity });
  }

  // 🔥 real-time update
  io.emit("cart-updated", {
    userId,
    cart: cart[userId],
  });

  return res.json({
    message: "Added to cart",
    cart: cart[userId],
  });
});

// =======================
// 📊 GET CART COUNT
// =======================
app.get("/api/cart/count/:userId", (req, res) => {
  const { userId } = req.params;

  const userCart = cart[userId] || [];

  const count = userCart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  res.json(count);
});

// =======================
// 🚀 START SERVER
// =======================
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Notification + Cart service running on port ${PORT}`);
});