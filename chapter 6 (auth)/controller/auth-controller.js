const User = require("../model/user");
const bcrypt = require("bcryptjs"); //package for encryption and decrption

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
    const newlyCreatedUser = new user({
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

    //create a tocken - based on the user information
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error Occured! ",
    });
  }
};

module.exports = { login_controller, registerUser };
