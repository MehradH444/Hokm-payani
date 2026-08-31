require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./db');

const app = express();
const server = http.createServer(app);

// تنظیمات میانی (Middleware)
app.use(cors());
app.use(express.json());

// اتصال به دیتابیس
connectDB();

// تنظیمات WebSocket برای بازی هم‌زمان
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Hokm Master Server is running' });
});

// مدیریت اتصالات سوکت
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[Server] Hokm Master Backend running on port ${PORT}`);
});
