const { Server } = require('socket.io');
// const http = require('http');

const createSocket = (http) => {
  const io = new Server(http, {
    cors: {
      origin: /^http:\/\/localhost:\d+$/,
      methods: ['GET', 'POTS'],
    },
  });

  io.on('connection', function (socket) {
    socket.on('DIALOGS:JOIN', (roomId) => {
      // socket.dialogId = dialogId;
      console.log(roomId, 'adasd');
      socket.join(roomId);
    });
    socket.on('DIALOGS:NEW_MESSAGE', ({ roomId, text, userName }) => {
      const obj = {
        userName,

        text,
      };

      // socket.emit('DIALOGS:NEW_MESSAGE', obj);
      io.to(roomId).emit('DIALOGS:NEW_MESSAGE', obj);
    });
    socket.on('DIALOGS:TYPING', (obj) => {
      socket.broadcast.emit('DIALOGS:TYPING', obj);
    });
  });

  return io;
};

module.exports = createSocket;
