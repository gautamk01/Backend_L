const jwt = require("jsonwebtoken");
//in header you will get all the property
//in that we will get the autherorisation
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  //This will make the functionality of auth without token you can't get inside

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access deined No token is provided please login to continue",
    });
  } else {
    //decode the information from the token
    try {
      //using jwt we will verify the token and pass it to the req.userInfo
      const decodedTokenInfo = jwt.verify(token, process.env.jwt_secret_key);
      //in a real project we needed to pass this infromation to the front end we will
      req.userInfo = decodedTokenInfo;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Access Denied NO token provided please login to connect",
        data: err,
      });
    }
  }
};

module.exports = authMiddleware;
