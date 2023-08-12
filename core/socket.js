const { Server } = require('socket.io');
// const http = require('http');

const createSocket = (http) => {
  const io = new Server(http, {
    cors: {
      origin: /^http:\/\/localhost:\d+$/,
      methods: ['GET', 'POTS'],
    },
  });

  const onlineUsers = new Map();

  io.on('connection', function (socket) {
    // console.log(socket.id);

    socket.on('USER:STATUS', (id) => {
      if (id !== null) {
        onlineUsers.set(socket.id, id);
        io.emit('USER:STATUS', Array.from(onlineUsers.values()));
      }
    });

    socket.on('DIALOGS:JOIN', (roomId) => {
      socket.join(roomId);
    });
    socket.on('DIALOGS:NEW_MESSAGE', ({ roomId, text, userName }) => {
      const obj = {
        userName,
        text,
      };
      io.to(roomId).emit('DIALOGS:NEW_MESSAGE', obj);
    });
    socket.on('DIALOGS:TYPING', (obj) => {
      socket.broadcast.emit('DIALOGS:TYPING', obj);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      // Удаление пользователя из списка онлайн при разрыве соединения
      const userId = socket.id;

      if (userId !== undefined) {
        onlineUsers.delete(userId);
        io.emit('USER:STATUS', Array.from(onlineUsers.values()));
      }
    });
  });

  return io;
};

module.exports = createSocket;
