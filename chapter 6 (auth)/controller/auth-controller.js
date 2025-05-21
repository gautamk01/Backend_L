//register Controller - to add a new user
const registerUser = async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error Occured! ",
    });
  }
};

module.exports = { login_controller, registerUser };
