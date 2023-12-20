const models = require("../models");
const Sequelize = require("sequelize");

exports.getAllMessageGlobal = (req, res, next) => {
  models.Chat.findAll({ include: "user" })
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllRooms = async (req, res, next) => {
  const uuid = req.token.userUuid;

  try {
    const user = await models.User.findOne({ where: { uuid } });

    let options = {
      [Sequelize.Op.or]: [{ userId1: user.id }, { userId2: user.id }],
    };

    if (req.query.to) {
      const to = await models.User.findOne({ where: { uuid: req.query.to } });
      options = {
        userId1: { [Sequelize.Op.or]: [user.id, to.id] },
        userId2: { [Sequelize.Op.or]: [user.id, to.id] },
      };
    }

    const rooms = await models.Room.findAll({
      where: options,
      include: ["user1", "user2"],
    });

    return res.status(200).json(rooms);
  } catch (e) {
    console.log(e);
  }
};

exports.getMessagesRoom = async (req, res, next) => {
  try {
    const messages = await models.Private.findAll({
      where: { roomId: req.params.roomId },
      include: "user",
    });
    return res.status(200).json(messages);
  } catch (e) {
    console.log(e);
  }
};

exports.MarkAsRead = async (req, res) => {
  const userUuid = req.query.userUuid;

  try {
    const user = await models.User.findOne({ where: { uuid: userUuid } });

    const messages = await models.Private.findAll({
      where: { userId: user.id, roomId: req.params.roomId, viewed: false },
    });

    for (let i in messages) {
      messages[i].viewed = true;
      await messages[i].save();
    }

    return res.status(200).json({ message: "Messages marquer comme lu" });
  } catch (e) {
    return res.status(500).json(e);
  }
};
