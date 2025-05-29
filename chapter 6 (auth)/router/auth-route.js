//Http route for Registering the user and login to a perticular user
const express = require("express");
const {
  registerUser,
  login_controller,
  changePassword,
} = require("../controller/auth-controller");
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();

//all router are related to authentication and auth
router.post("/register", registerUser);
router.post("/login", login_controller);
router.post("/passchange", authMiddleware, changePassword);

module.exports = router;
