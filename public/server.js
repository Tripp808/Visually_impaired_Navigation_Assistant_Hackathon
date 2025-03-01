import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle emergency alerts
  socket.on('emergency_alert', (data) => {
    // In a real app, this would send alerts to emergency contacts
    console.log('Emergency alert received:', data);
    // Broadcast to all connected clients (could be used for caretaker monitoring)
    socket.broadcast.emit('emergency_notification', {
      message: 'Emergency alert triggered',
      location: data.location
    });
  });
  
  // Handle location sharing
  socket.on('location_update', (data) => {
    // In a real app, this would update location in a database
    console.log('Location update received:', data);
    // Could be used to track user's location by caretakers
    socket.broadcast.emit('location_update', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Main route
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});