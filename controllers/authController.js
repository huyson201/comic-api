const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
class AuthController {
  //login function
  async login(req, res) {
    let { user_email, user_password } = req.body;

    try {
      // get user by email
      let user = await User.findOne({ where: { user_email } });
      if (user === null) return res.json({ message: "email not exist!" });

      // check password
      let compare = bcrypt.compareSync(user_password, user.user_password);

      if (!compare) return res.json({ message: "password not invalid" });

      // generate token and refresh token
      let payload = {
        ...user.dataValues,
        user_password: undefined,
        remember_token: undefined,
      };

      let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2h",
      });

      let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      // save refresh token to user
      user.update({ remember_token: refreshToken });

      return res.status(200).json({
        msg: "login successfully",
        data: {
          user,
          token: token,
          refreshToken: refreshToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send("something error");
    }
  }

  // create new user
  async register(req, res) {
    // get request data
    let { user_email, user_password, user_name, confirm_password } = req.body;

    if (!confirm_password || confirm_password !== user_password)
      return res.json({
        message: "confirm password invalid",
      });

    // create a new user
    try {
      let checkUser = await User.findOne({ where: { user_email } });
      if (checkUser) return res.status(400).send("email exist");

      let user = await User.create({
        user_email,
        user_password,
        user_name,
      });

      return res.status(201).json({
        msg: "Success",
        data: user,
      });

    } catch (err) {
      console.log(err);
      return res.status(400).send("something error");
    }
  }

  // logout
  logout(req, res) {
    // get user
    let user = req.user

    if (!user) return res.status(401).send("unauthorized")

    try {
      user.logout()
      return res.status(204).send("logout success!")
    } catch (error) {
      return res.status(400).send(error.message)
    }

  }

  async refreshToken(req, res) {
    let refreshToken = req.body.refreshToken;

    try {
      let user = await User.findOne({
        where: { remember_token: refreshToken },
      });
      if (!user) return res.json({ message: "refresh token not exist" });
      // check token
      try {
        // check expired
        let { exp } = jwt_decode(refreshToken);
        if (Date.now() >= exp * 1000)
          return res.json({ message: "refresh token expired" });

        // verify token
        let decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        if (!decoded) return res.json({ message: "token invalid" });

        // generate token and refresh token
        let payload = {
          ...user.dataValues,
          user_password: undefined,
          remember_token: undefined,
        };

        let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "2h",
        });
        console.log(user);
        return res.status(200).json({
          message: "success",
          data: user,
          token: token,
        });
      } catch (err) {
        // err
        console.log(err);
        return res.status(err.message)
      }
    } catch (err) {
      return res.status(err.message)
    }
  }
}

const authController = new AuthController();

module.exports = authController;
