const models = require("../models");

exports.getAllLikes = (req, res) => {
  models.Like.findAll({ where: { postId: req.params.postId }, include: 'user' })
    .then((likes) => {
      return res.status(200).json(likes);
    })
    .catch((error) => res.status(400).json(error));
};

// exports.getOneLike = async (req, res) => {
//   const userUuid = req.token.userUuid;

//   try{
//     const user = await models.User.findOne({ where: { uuid: userUuid } });
//     const likeExist = await models.Like.findOne({ where: { userId: user.id, postId: req.params.postId }});
//     return res.status(200).json(likeExist);
//   }catch(error){
//     return res.status(400).json(error);
//   }
// };

exports.likePost = async (req, res) => {
  const userUuid = req.token.userUuid;

  try {
    const user = await models.User.findOne({ where: { uuid: userUuid } });

    const post = await models.Post.findOne({
      where: { id: req.params.postId },
    });

    const likeExist = await models.Like.findOne({ 
      where: { userId: user.id, postId: req.params.postId }
    });

    if (likeExist) {
      await post.update({ likes: post.likes - 1 });
      await likeExist.destroy();
      return res.status(200).json({ like: false });
    } else {
      if(post.userId != user.id){
        await models.Notification.create({ userId: post.userId, userSender: user.id, postId: post.id, content: 'aimé' })
      }
      await post.update({ likes: post.likes + 1 });
      await models.Like.create({ userId: user.id, postId: req.params.postId });
      return res.status(200).json(user);
    }

  } catch (error) {
    return res.status(400).json(error);
  }
};
