const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res, next) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail: mail.toLowerCase() });
    if (!user) {
      return res.status(401).send("This user doesn't exist. Please Register");
    }
    if (user && bcrypt.compare(password, user.password)) {
      //send new token
      const token = jwt.sign(
        {
          userId: user._id,
          mail,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({
        userDetails: {
          mail: user.mail,
          token: token,
          username: user.username,
          _id: user._id, 
        },
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Something went wrong, Please try again later." });
  }
};
module.exports = postLogin;
