const cors = require('cors');
const express = require('express');
const checkAuth = require('../utils/checkAuth');
const controllers = require('../controllers/index');
const UserController = require('../controllers/UserController');
const DialogsController = require('../controllers/DialogsController');
const MessagesController = require('../controllers/MessagesController');

const createRoutes = (app, io) => {
  // const DialogsController = new controllers.DialogCtrl();
  // const MessagesController = new controllers.MessageCtrl();
  const user = new UserController(io);
  const dialogs = new DialogsController(io);
  const messages = new MessagesController(io);

  app.use(express.json());
  app.use(cors());

  app.post('/auth/signin', user.login);
  app.post('/auth/signup', user.register);
  app.get('/auth/me', checkAuth, user.getMe);

  app.get('/friends', checkAuth, user.getUsers);

  app.post('/im', checkAuth, dialogs.create);
  app.get('/im', checkAuth, dialogs.getAll);
  app.get('/count', checkAuth, dialogs.getCount);

  app.get('/im/:id', checkAuth, messages.getAll);
  app.post('/message', checkAuth, messages.create);

  app.get('/socket', dialogs.checkSocket);

  app.get('/', (req, res) => {
    res.send('Hello');
  });
};

module.exports = createRoutes;
