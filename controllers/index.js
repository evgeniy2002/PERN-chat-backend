// export { default as UsrCtrl } from './UserController';
// export { default as DialogCtrl } from './DialogsController';
// export { default as MessageCtrl } from './MessagesController';

const UserController = require('./UserController');
const DialogsController = require('./DialogsController');
const MessagesController = require('./MessagesController');

module.exports = {
  UserController,
  DialogsController,
  MessagesController,
};
