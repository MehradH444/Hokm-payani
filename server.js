require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const socketHandler = require('./socketHandler');

const app = express();
const server = http.createServer(app);

// تنظیمات میانی (Middleware)
app.use(cors());
app.use(express.json());

// اتصال به دیتابیس
connectDB();

// روت‌های API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Hokm Master Server is running' });
});

// تنظیمات WebSocket برای بازی هم‌زمان
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// فراخوانی هندلر WebSocket
socketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[Server] Hokm Master Backend running on port ${PORT}`);
});
