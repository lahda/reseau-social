const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const user = require("../controllers/user.controllers");

router.get("/:uuid", auth, user.getUserProfile);
router.get("", auth, user.getAllUsers);
router.post("/register", user.register);
router.post("/login", user.login);
router.put("/:uuid", auth, multer.fields([{name: 'avatar'}, {name: 'couverture'}]), user.modifyProfile);

module.exports = router;