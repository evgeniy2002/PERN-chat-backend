const { Op } = require('sequelize');
const { Dialog, User } = require('../models/models');
const uuid = require('uuid');
const { model } = require('../db');
const createSocket = require('../core/socket');

class DialogsController {
  constructor(io) {
    this.io = io;
    this.name = 'join';
  }
  create = async (req, res) => {
    // var id = uuid.v4();

    const existingDialog = await Dialog.findOne({
      where: {
        partnerId: req.body.partnerId,
        userId: req.body.userId,
      },
    });
    // console.log(checkDialogs);
    if (existingDialog) {
      return;
    } else {
      try {
        const doc = await Dialog.create({
          // id,
          lastMessage: '',
          userId: req.body.userId,
          partnerId: req.body.partnerId,
        });

        const dialog = await doc.save();
        // console.log(dialog);
        // this.io.emit('SERVER:DIALOG_CREATED', dialog);

        res.json(dialog);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Не удалось создать диалог',
        });
      }
    }
    // if (checkDialogs.length > 0) {
    //   if (checkDialogs[0].dataValues.userId !== req.body.userId) {
    //     console.log(123);
    //     return;
    //   }
    // }
    // if (checkDialogs[0].dataValues.userId === req.body.userId && checkDialogs.length > 0) {
    //   // if (checkDialogs.length > 0) {
    //   // this.io.emit('SERVER:DIALOG_CREATED', checkDialogs[0]);
    //   return;
    // }
  };
  getAll = async (req, res) => {
    try {
      let existingDialogId = null;

      const { userId, partnerId } = req.query;
      if (partnerId !== '0') {
        const existingDialog = await Dialog.findOne({
          where: {
            [Op.or]: [
              {
                [Op.and]: [{ userId }, { partnerId }],
              },
              {
                [Op.and]: [{ userId: partnerId }, { partnerId: userId }],
              },
            ],
          },
        });

        existingDialogId = existingDialog.id;
      }

      const dialogs = await Dialog.findAll({
        where: { userId: req.userId },
        include: [
          {
            model: User,
            as: 'Partner',
            foreignKey: 'partnerId',
            attributes: { exclude: ['password'] },
          },
        ],
      });

      if (existingDialogId !== null) {
        res.json({ existingDialogId, dialogs });
      } else {
        res.json(dialogs);
      }
    } catch (error) {
      res.status(500).json({
        message: 'Не удалось получить диалоги',
      });
    }
  };
  checkSocket = async (req, res) => {
    const { userId, partnerId } = req.body;

    try {
      const existingDialog = await Dialog.findOne({
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ userId }, { partnerId }],
            },
            {
              [Op.and]: [{ userId: partnerId }, { partnerId: userId }],
            },
          ],
        },
      });
      if (existingDialog) {
        console.log(existingDialog.id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  getCount = async (req, res) => {
    try {
      const count = await Dialog.count();

      res.json(count);
    } catch (error) {
      res.status(500).json({
        message: 'Не удалось получить кол-во диалогов',
      });
    }
  };
}

module.exports = DialogsController;
