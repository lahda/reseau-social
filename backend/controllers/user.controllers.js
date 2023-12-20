const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const fs = require("fs");
const Sequelize =  require('sequelize');

exports.register = (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if(!/^(?=.*\d).{4,8}$/.test(password)){
    return res.status(400).json({ error: "password incorrect" }); 
  }

  models.User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        bcrypt
          .hash(password, 10)
          .then((bcryptedPassword) => {
            models.User.create({
              firstname,
              lastname,
              email,
              password: bcryptedPassword,
              isAdmin: 0
            })
              .then((newUser) => {
                res.status(201).json(newUser);
              })
              .catch((e) => res.status(500).json(e));
          })
          .catch((error) => res.status(500).json({ error }));
      } else return res.status(400).json({ error: "Email dèjà existant !" });
    })
    .catch(() => res.status(500).json({ error: "Un problème est survenu" }));
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (email == null || password == null) {
    return res.status(400).json({ error: "missing parameters" });
  }

  models.User.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(400)
                .json({ error: "Adresse email ou mot de passe incorrect" });
            }
            res.status(200).json({
              user,
              token: jwt.sign(
                { userUuid: user.uuid, isAdmin: user.isAdmin },
                "SECRET_TOKEN"
              ),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      } else return res.status(400).json({ error: "Adresse email ou mot de passe incorrect" });
    })
    .catch(() => res.status(500).json({ error: "Un problème est survenu" }));
};

exports.getUserProfile = (req, res) => {
  models.User.findOne({
    where: { uuid: req.params.uuid }
  })
    .then((user) => {
      if (user) return res.status(201).json(user);
      else return res.status(404).json({ error: "user not found" });
    })
    .catch(() => res.status(500).json({ error: "cannot fetch user" }));
};

exports.getAllUsers = (req, res, next) => {
  const options = {
    where: Sequelize.where(
      Sequelize.fn(
        'concat',
        Sequelize.col('firstName'),
        ' ',
        Sequelize.col('lastName')
      ),
      {
        [Sequelize.Op.like]: `%${req.query.search}%`
      }
    ),
    limit: 10
  }

  models.User.findAll(options)
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ error })
    })
}

exports.modifyProfile = (req, res) => {
  const uuid = req.token.userUuid;

  if (uuid != req.params.uuid)
    return res.status(400).json({ error: "wrong token" });

  if (req.files) {
    models.User.findOne({ where: { uuid } })
      .then((user) => {
        if(req.files.avatar){
          const avatar = user.avatar.split("/images/")[1];
          if(avatar != undefined){
            fs.unlink(`images/${avatar}`, (error) => {
              if (error) res.status(400).json({ error });
            });
          }
        }
        if(req.files.couverture){
          const couverture = user.couverture.split("/images/")[1];
          if(couverture != undefined){
            fs.unlink(`images/${couverture}`, (error) => {
              if (error) res.status(400).json({ error });
            });
          }
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }

  const editUser = req.files
    ? {
        ...JSON.parse(req.body.user),
        avatar: req.files.avatar
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.avatar[0].filename
            }`
          : req.body.avatar,
        couverture: req.files.couverture
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.couverture[0].filename
            }`
          : req.body.couverture,
      }
    : { ...req.body };

  models.User.findOne({
    where: { uuid },
  })
    .then((user) => {
      user
        .update(editUser)
        .then((user) => {
          if (user) return res.status(201).json(user);
          else
            return res
              .status(500)
              .json({ error: "cannot update user profile" });
        })
        .catch(() => {
          res.status(500).json({ error: "cannot update user" });
        });
    })
    .catch(() => res.status(500).json({ error: "unable to verify user" }));
};
