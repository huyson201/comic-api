require('dotenv').config()
const { User, sequelize, Follow } = require("../models");
const bcrypt = require("bcrypt");
const { uploadFile } = require('../util/s3')
class UserController {
  //get all users
  async index(req, res) {
    let { limit, offset, sort } = req.body;
    let uuid = req.user_uuid;
    const query = {};
    if (offset) query.offset = +offset;
    if (limit) query.limit = +limit;

    if (sort) {
      let col = sort.split(":")[0];
      let value = sort.split(":")[1];
      query.order = [[col, value]];
    }
    try {
      let user = await User.findByPk(uuid);
      if (!user)
        return res.json({ err: "you mustn't login before accessing!" });
      if (user.user_role !== "admin")
        return res.json({ err: "you don't have permission!" });

      let users = await User.findAll(query);

      return res.json({
        msg: "success",
        data: users,
      });
    } catch (err) {
      return res.send(err);
    }
  }

  // get user by uuid
  async getById(req, res) {
    let userId = req.params.uuid;
    let uuid = req.user_uuid;

    try {
      let user = await User.findByPk(uuid);
      if (!user) return res.status(400).send('user not found!');

      if (user.user_role !== "admin" && uuid !== userId) return res.status(403).send("You don't have permission!");

      let userDetail = await User.findByPk(userId);

      res.json({
        msg: "Success",
        data: userDetail,
      });
    } catch (err) {
      res.send(err);
    }
  }

  // create new user
  async create(req, res) {
    // get request data
    let { user_email, user_password, user_name, user_role } = req.body;

    if (!user_role) user_role = "user";

    // create a new user
    try {
      let checkUser = await User.findOne({ where: { user_email } });
      if (checkUser) return res.json({ err: "Email exist!" });
      let user = await User.create({
        user_email,
        user_password,
        user_name,
        user_role,
      });
      return res.json({
        msg: "Success",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.json({ error: "something error" });
    }
  }

  // update user
  async update(req, res) {
    let data = req.body;
    let uuid = req.user_uuid;
    try {
      let user = await User.findByPk(uuid);
      if (!user) return res.status(400).send('User not found!')

      if (req.file) {
        let result = await uploadFile(req.file)
        data.user_image = process.env.ROOT + '/images/' + result.key
      }

      user = await user.update(data);
      return res.json({
        msg: "Update success",
        data: user,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  async changePassword(req, res) {
    let { old_password, new_password } = req.body;
    let uuid = req.user_uuid;

    try {
      let user = await User.findByPk(uuid);
      if (!user) return res.json({ err: "User not found" });

      // verify password
      let verifyPassword = bcrypt.compareSync(old_password, user.user_password);
      if (!verifyPassword) res.json({ err: "Old password invalid" });
      user.user_password = new_password;
      user = await user.save();
      return res.json({
        msg: "Change password success",
        data: user,
      });
    } catch (err) { }
  }

  async getFollows(req, res) {
    let uuid = req.params.uuid;
    let { limit, offset, sort } = req.query;
    let query = {};

    query.subQuery = false;

    if (offset) query.offset = +offset;
    if (limit) query.limit = +limit;

    if (sort) {
      let col = sort.split(":")[0];
      let value = sort.split(":")[1];
      query.order = [
        [sequelize.literal("`comics_follow`." + "`" + col + "`"), value],
      ];
    }

    query.include = [
      {
        association: "comics_follow",
        attributes: [
          "comic_id",
          "comic_name",
          "comic_img",
          "createdAt",
          "updatedAt",
        ],
        through: {
          attributes: [],
        },
      },
    ];
    try {
      let countComics = await Follow.count({ where: { user_uuid: uuid } });

      let user = await User.findByPk(uuid, query);
      user = user.toJSON();
      user.count = countComics;
      return res.status(200).json({
        code: 200,
        name: "",
        msg: "success",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }
}
const userController = new UserController();
module.exports = userController;
