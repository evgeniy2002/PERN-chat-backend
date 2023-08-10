require('dotenv').config();
const express = require('express');
const app = express();

const sequelize = require('./db');
const models = require('./models/models');
const createRoutes = require('./core/routes');

const createSocket = require('./core/socket');

const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 9999;

const io = createSocket(server);

createRoutes(app, io);

// io.on('connection', (socket) => {
//   socket.on('DIALOGS:JOIN', (id) => {
//     // socket.dialogId = id;
//     socket.join(id);
//     // console.log(dialogId);
//     console.log(id);
//   });
//   socket.on('DIALOG:MESSAGE', ({ dialogId, userName, text }) => {
//     const obj = { userName, text };

//     socket.broadcast.to(dialogId).emit('DIALOG:MESSAGE', obj);
//   });
//   // socket.on('CHAT:JOIN', data);
//   // clients++;
//   // socket.emit('newClientConnect', { desc: 'welcome' });
//   // socket.broadcast.emit('newClientConnect', { desc: clients + ' clients connected' });
//   // socket.on('DIALOGS:JOIN', (dialogId) => {
//   //   // socket.dialogId = dialogId;
//   //   socket.join(dialogId);
//   //   console.log(dialogId);
//   // });
//   // socket.on('DIALOGS:TYPING', (obj) => {
//   //   socket.broadcast.emit('RECEIVE_MESSAGE', data);
//   // });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//     // clients--;
//     // socket.emit('broadcast', { desc: clients + ' clients connected' });
//   });
// });

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(PORT, () => {
      console.log('Сервер запущен');
    });
  } catch (error) {
    console.log(error);
  }
};
start();
