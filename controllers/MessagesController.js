const { Message, User, Dialog } = require('../models/models');

class MessagesController {
  constructor(io) {
    this.io = io;
  }

  create = async (req, res) => {
    try {
      const { roomId: dialogId, text, userId, currentDialogId } = req.body;

      const doc = await Message.create({
        text,
        dialogId,
        userId,
      });

      const message = await doc.save();

      // const lastMessage = await Message.findOne({
      //   where: { dialogId },
      //   order: [['createdAt', 'DESC']],
      // });

      // await Dialog.update(
      //   { lastMessage: lastMessage.dataValues.text },
      //   { where: { id: dialogId } },
      // );

      this.io.emit('DIALOGS:NEW_MESSAGE', message);

      res.json(message);
    } catch (error) {
      res.status(500).json({
        message: 'Не удалось отправить сообщение',
      });
    }
  };
  getAll = async (req, res) => {
    try {
      const id = req.params.id;

      const messages = await Message.findAll({
        where: {
          dialogId: id,
        },
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] },
          },
        ],
      });
      // const existingDialog = await Dialog.findOne({
      //   where: {
      //     [Op.or]: [
      //       {
      //         [Op.and]: [{ userId }, { partnerId }],
      //       },
      //       {
      //         [Op.and]: [{ userId: partnerId }, { partnerId: userId }],
      //       },
      //     ],
      //   },
      // });

      // if (existingDialog) {
      //   console.log(existingDialog.id);
      // }
      res.json(messages);
    } catch (error) {
      res.status(500).json({
        message: 'Не удалось загрузить сообщения',
      });
    }
  };
}

module.exports = MessagesController;
