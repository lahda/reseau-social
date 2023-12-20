const path = require("path");
const models = require("./models");
const Sequelize = require("sequelize");
const webpush = require("web-push");

const vapidKeys = {
  publicKey:
    "BMdqQbJomMhyKKAj4FefuaE9s9lCyJDiGWftKCXzb1eUgFd4IJOZyLE4ufzdJokjFlG1D0blkKG3IA72ARH8HlQ",
  privateKey: "Go2THsApXek4xY6klw1EwhWKRdSOC0ORcbnzoCZxjDI",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


const express = require("express");
const app = express();

const server = require("http").createServer(app);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const chatRoutes = require("./routes/chat.routes");
const notificationRoutes = require("./routes/notification.routes");

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notification", notificationRoutes);

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3000");

server.listen(port, () => {
  console.log("Listening on " + port);
});

// Socket
const io = require("socket.io")(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let users = [];

io.on("connection", (socket) => {
  let uuid = "";
  console.log("\nConnection\n");

  socket.on("login", async (payload) => {
    console.log("\nConnecté, ", payload, "\n");
    uuid = payload.uuid;
    users[uuid] = socket.id;
    try {
      const user = await models.User.findOne({ where: { uuid: payload.uuid } });
      user.isConnected = true;
      await user.save();
      io.emit("login", payload);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("global message", async function (data) {
    try {
      const user = await models.User.findOne({
        where: { uuid: data.uuid },
      });

      const newMessage = await models.Chat.create({
        message: data.message,
        userId: user.id,
      });

      const message = await models.Chat.findOne({
        where: { id: newMessage.id },
        include: "user",
      });

      io.emit("global message", message);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("private message", async function ({ sender, receiver, message }) {
    try {
      const userSender = await models.User.findOne({
        where: { uuid: sender },
      });

      const userReceiver = await models.User.findOne({
        where: { uuid: receiver },
      });

      let room = await models.Room.findOne({
        where: {
          userId1: { [Sequelize.Op.or]: [userReceiver.id, userSender.id] },
          userId2: { [Sequelize.Op.or]: [userSender.id, userReceiver.id] },
        },
      });

      if (!room) {
        room = await models.Room.create({
          userId1: userSender.id,
          userId2: userReceiver.id,
        });
      }

      const newMessage = await models.Private.create({
        userId: userSender.id,
        roomId: room.id,
        message: message,
      });

      const messageFind = await models.Private.findOne({
        where: { id: newMessage.id },
        include: "user",
      });

      const socketId = users[receiver];
      io.to(socketId).emit("private message", messageFind);

      // Push Notification
      const pushSubscriptions = await models.PushNotification.findAll({
        where: { userId: userReceiver.id },
      });
      for(let i in pushSubscriptions){
        const subscription = {
          endpoint: pushSubscriptions[i].endpoint,
          keys: {
            auth: pushSubscriptions[i].auth,
            p256dh: pushSubscriptions[i].p256dh,
          },
        };
        const payload = JSON.stringify({
          title: `Message de : ${userSender.firstname} ${userSender.lastname}`,
          icon: userSender.avatar,
          message: message,
        });
        webpush.sendNotification(subscription, payload);
      }

    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("\n\nUser disconnected " + uuid + "\n");
    delete users[uuid];
    try {
      const user = await models.User.findOne({ where: { uuid } });
      user.isConnected = false;
      await user.save();
      io.emit("logout", { uuid });
    } catch (e) {
      console.log(e);
    }
  });
});
