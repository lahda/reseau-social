const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const chat = require("../controllers/chat.controllers");

router.get("/", auth, chat.getAllMessageGlobal);
router.get("/rooms", auth, chat.getAllRooms);
router.get("/room/:roomId", auth, chat.getMessagesRoom);
router.post("/room/:roomId", auth, chat.MarkAsRead);

module.exports = router;