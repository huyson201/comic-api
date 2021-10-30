const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken, generateRefreshToken } = require('../util')
class AuthController {
  //login function
  async login(req, res) {
    let { user_email, user_password } = req.body;

    try {
      // get user by email
      let user = await User.findOne({ where: { user_email } });
      if (user === null) return res.status(400).send("Email không tồn tại!");

      // check password
      let compare = bcrypt.compareSync(user_password, user.user_password);

      if (!compare) return res.status(400).send("Sai mật khẩu!");

      // generate token and refresh token

      let token = generateToken(user, process.env.ACCESS_TOKEN_SECRET, "2h")

      let refreshToken = generateRefreshToken(user, process.env.REFRESH_TOKEN_SECRET, "7d")


      // save refresh token to user
      user.update({ remember_token: refreshToken });

      return res.status(200).json({
        message: "Đăng nhập thành công",
        data: {
          user,
          token: token,
          refreshToken: refreshToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  // create new user
  async register(req, res) {
    // get request data
    let { user_email, user_password, user_name, confirm_password } = req.body;

    if (!confirm_password || confirm_password !== user_password)
      return res.status(400).send("Mật khẩu không khớp!");
    // create a new user
    try {
      let checkUser = await User.findOne({ where: { user_email } });
      if (checkUser) return res.status(400).send("Email đã tồn tại");

      let user = await User.create({
        user_email,
        user_password,
        user_name,
      });

      return res.status(201).json({
        message: "Đăng ký thành công",
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
      return res.status(204).send("Đăng xuất thành công!")
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
      if (!user) return res.status(400).send("RefreshToken không tồn tại");
      // check token


      // verify token
      let decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (!decoded) return res.status(400).send("Token không đúng");

      // generate token and refresh token


      let token = generateToken(user, process.env.ACCESS_TOKEN_SECRET, "2h")

      return res.status(200).json({
        message: "success",
        token: token,
      });

    } catch (err) {
      return res.status(400).send(err.message)
    }
  }
}

const authController = new AuthController();

module.exports = authController;
