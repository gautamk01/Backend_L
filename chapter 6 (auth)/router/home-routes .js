const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminmiddleware = require("../middleware/admin-middleware");

const router = express.Router();

//we can have multiple handler 1, handler 2 , handler 3
// then it will check handler 1 is working or not and then check next handler
// if the user is not loged in -> the user should not access it
//if the user is loged in ->give access
//every time if we are given this url the auth middleware is called
//if the token is valid then the middle ware will be success
router.get("/welcome", authMiddleware, (req, res) => {
  const { username, userId, role } = req.userInfo;

  res.json({
    messsage: "welcome to the home page ",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

module.exports = router;
