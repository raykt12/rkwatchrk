const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Global state to store the latest video URL
let currentVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Default URL

app.use(express.static('public')); // Serve static files

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the current video URL to the newly connected user
  socket.emit('new-url', currentVideoUrl);

  // Handle new URL from clients
  socket.on('new-url', (url) => {
    console.log(`New video URL received: ${url}`);
    currentVideoUrl = url; // Update the global state
    io.emit('new-url', url); // Broadcast the new URL to all users
  });

  // Handle play, pause, and seek events
  socket.on('play', (time) => socket.broadcast.emit('play', time));
  socket.on('pause', (time) => socket.broadcast.emit('pause', time));
  socket.on('seek', (time) => socket.broadcast.emit('seek', time));

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
