const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id: ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', taskName => {
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskName);
  });

  socket.on('removeTask', taskIndex => {
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', taskIndex);
  });
});
