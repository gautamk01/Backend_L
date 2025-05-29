//Controller mainly focuse on the function of router specifically the
const User = require("../model/user");
const bcrypt = require("bcryptjs"); //package for encryption and decrption
const jwt = require("jsonwebtoken"); // to store the token

//register Controller - to add a new user
const registerUser = async (req, res) => {
  try {
    //1. extract the user information form our requestbody
    const { username, email, password, role } = req.body;
    //check if the user is alreadu existe in our database
    const checkExistinguser = await User.findOne({
      $or: [{ username }, { email }],
    });
    //using or handler we can check any user exsiting or not
    if (checkExistinguser) {
      return res.status(400).json({
        success: false,
        message:
          "User is already existing either with same username or same email",
      });
    }

    //if the user desnot exisite
    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    //create a new user and save it our database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedpassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "user registered Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "unable to register te user please try again",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured! please try again",
    });
  }
};

//login controller - {login to an exisiting solution}
const login_controller = async (req, res) => {
  try {
    const { username, password } = req.body;

    //find if the current user is existe in database or not
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials ",
      });
    }

    //checking the matching of the password
    //if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }
    //bareer token - to store the token  , you can store in a cookie and pass the token to front end and store it in session
    // 1.cookies or 2. session Store

    //create a tocken - based on the user information
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.jwt_secret_key,
      { expiresIn: "35m" }
    ); //User information

    res.status(200).json({
      success: true,
      message: "loged in",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error Occured! ",
    });
  }
};

//change the password functionality  (always  imagein the frontend perpective )
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract the old and new password
    //checking the old and new password

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "old and new passord is not passsed is not found ",
      });
    }
    const { oldpassword, newpassword } = req.body;

    //find the loged in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not found ",
      });
    }

    //check the old password given is correct
    const ispassword = await bcrypt.compare(oldpassword, user.password);

    if (!ispassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect , please try again",
      });
    }

    //hashing the new passwrod
    const salt = await bcrypt.genSalt(10);
    const newhashpassword = await bcrypt.hash(newpassword, salt);

    //update the user password
    user.password = newhashpassword;
    await user.save();

    //return the success resonse
    res.status(200).json({
      success: true,
      message: "The password has changed properly",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Access Deinied ",
    });
  }
};

module.exports = { login_controller, registerUser, changePassword };
