const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notNull: { msg: 'Fullname is required' } },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notNull: { msg: 'Email is required' } },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notNull: { msg: 'Password is required' } },
  },
  avatar: { type: DataTypes.STRING, allowNull: true },
});

const Message = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Dialog = sequelize.define('dialog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lastMessage: {
    type: DataTypes.STRING,
  },
  partnerId: {
    type: DataTypes.INTEGER,
  },
});

// const DialogUser = sequelize.define('Dialog_User', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
// });

User.hasMany(Message);
Message.belongsTo(User);

// User.belongsToMany(Dialog, { through: DialogUser });
// Dialog.belongsToMany(User, { through: DialogUser });
User.hasMany(Dialog);
Dialog.belongsTo(User, { as: 'User', foreignKey: 'userId' });
Dialog.belongsTo(User, { as: 'Partner', foreignKey: 'partnerId' });

Dialog.hasMany(Message);
Message.belongsTo(Dialog);

module.exports = {
  User,
  Message,
  Dialog,
  // DialogUser,
};

// dateJoined: {
//   type: DataTypes.DATE,
//   defaultValue: DataTypes.NOW
// }
