const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const postRegister = async (req, res, next) => {
  try {
    const { username, password, mail } = req.body;
    const userExist = await User.exists({ mail: mail.toLowerCase() });
    console.log(userExist);
    //checking if user existsi
    if (userExist) {
       return res.status(409).send("This email is already registerd, Please login!");
    }
    // encrypt password
    encryptedPassword = await bcrypt.hash(password, 10);
    //saving to database
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });
    //create JWT token
    const token = "JWT TOKEN";
    res.status(201).json({
      username: user.username,
      mail: user.mail,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error occured, please try again later");
  }
};

module.exports = postRegister;
