const models = require("../models");

exports.pushSubscription = async (req, res) => {
  const subscription = req.body;
  const userUuid = req.token.userUuid;
  try {
    const user = await models.User.findOne({ where: { uuid: userUuid } });
    const isSubscribe = await models.PushNotification.findOne({ where : { userId: user.id, endpoint: subscription.endpoint}})
    if(!isSubscribe){
      await models.PushNotification.create({
        userId: user.id,
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh
      });
      return res.status(201).json({message: 'Inscription résussi !'});
    }
    return res.status(201).json({message: 'Deja inscrit'});
  } catch (e) {
    return res.status(500).json(e);
  }
};

exports.getNotifications = async (req, res) => {
  const userUuid = req.token.userUuid;
  try {
    const user = await models.User.findOne({ where: { uuid: userUuid } });
    const notifications = await models.Notification.findAll({
      where: { userId: user.id },
      include: "sender",
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(notifications);
  } catch (e) {
    return res.status(500).json(e);
  }
};

exports.MarkAsRead = async (req, res) => {
  const userUuid = req.token.userUuid;
  
  try {
    const user = await models.User.findOne({ where: { uuid: userUuid } });

    const notifications = await models.Notification.findAll({
      where: { userId: user.id, viewed: false }
    });

    for(let i in notifications){
      notifications[i].viewed = true;
      await notifications[i].save();
    }

   return res.status(200).json({message: 'Notifications marquer comme lu'});

  } catch (e) {
    return res.status(500).json(e);
  }
};
