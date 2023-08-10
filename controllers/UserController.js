const { User } = require('../models/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class UserController {
  constructor(io) {
    this.io = io;
  }

  register = async (req, res) => {
    try {
      const candidate = await User.findOne({ where: { email: req.body.email } });
      if (candidate) {
        throw new Error('Пользователь с таким email уже существует');
      }
      const password = req.body.password;

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const doc = await User.create({
        email: req.body.email,
        password: hashPassword,
        fullName: req.body.fullName,
        avatar: req.body.avatar,
      });

      const user = await doc.save();
      user.then((data) => {
        const { password, ...userData } = data.dataValues;

        const token = jwt.sign(
          {
            id: userData.id,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: '30d',
          },
        );

        res.json({
          ...userData,
          token,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      const { password: passwordHash, ...userData } = user.dataValues;

      if (!user) {
        res.status(404).json({
          msg: 'Неверный логин или пароль',
        });
      }
      const isValidPass = await bcrypt.compare(password, passwordHash);
      if (!isValidPass) {
        res.status(404).json({
          msg: 'Неверный логин или пароль',
        });
      }
      const token = jwt.sign(
        {
          id: userData.id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '30d',
        },
      );
      res.json({
        ...userData,
        token,
      });
    } catch (error) {
      console.log(error);
    }
  };
  getMe = async (req, res) => {
    try {
      // console.log(req);
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
      const { password, ...userData } = user.dataValues;

      res.json(userData);
    } catch (error) {
      console.log(error);
      res.status(403).json({
        message: 'Нет доступа 3',
      });
    }
  };
  getUsers = async (req, res) => {
    const { search } = req.query;
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        where: {
          fullName: {
            [Op.like]: `%${search}%`,
          },
        },
      });

      // const { password, ...userData } = users;

      res.json(users);
    } catch (error) {
      res.status(403).json({
        message: 'Не удалось получить пользователей',
      });
    }
  };
}

module.exports = UserController;
