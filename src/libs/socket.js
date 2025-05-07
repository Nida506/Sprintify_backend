const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinCollaboration', (board_id, user) => {
    // if (!board_id) return;
    socket.join(board_id);
    console.log(user + '  joined ' + board_id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { io, app, server };
