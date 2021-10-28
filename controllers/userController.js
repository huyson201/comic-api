require('dotenv').config()
const { User, sequelize, Follow } = require("../models");
const bcrypt = require("bcrypt");
const { uploadFile } = require('../util/s3')
class UserController {
  //get all users
  async index(req, res) {
    let { limit, offset, sort } = req.body;

    const query = {};

    if (offset) query.offset = +offset;
    if (limit) query.limit = +limit;

    if (sort) {
      let col = sort.split(":")[0];
      let value = sort.split(":")[1];
      query.order = [[col, value]];
    }
    try {
      let user = req.user;
      if (!user)
        return res.status(401).send("unauthorized")
      if (user.user_role !== "admin")
        return res.status(403).send("don't have permission")

      let users = await User.findAll(query);

      return res.status(200).json({
        message: "success",
        data: users,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  // get user by uuid
  async getById(req, res) {
    let userId = req.params.uuid;

    try {
      let user = req.user;
      if (!user) return res.status(400).send('user not found!');

      if (user.user_role !== "admin" && uuid !== userId) return res.status(403).send("You don't have permission!");

      let userDetail = await User.findByPk(userId);

      res.status(200).json({
        message: "Success",
        data: userDetail,
      });
    } catch (err) {
      res.status(400).send(err.message);
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
      if (checkUser) return res.status(400).send("Email exist!");
      let user = await User.create({
        user_email,
        user_password,
        user_name,
        user_role,
      });
      return res.status(200).json({
        message: "Success",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  // update user
  async update(req, res) {
    let data = req.body;

    try {
      let user = req.user;
      if (!user) return res.status(400).send('User not found!')

      if (req.file) {
        let result = await uploadFile(req.file)
        data.user_image = process.env.ROOT + '/images/' + result.key
      }

      user = await user.update(data);
      return res.status(200).json({
        message: "Update success",
        data: user,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  async changePassword(req, res) {
    let { old_password, new_password } = req.body;


    try {
      let user = req.user;
      if (!user) return res.status(401).send("unauthorized");

      // verify password
      let verifyPassword = bcrypt.compareSync(old_password, user.user_password);
      if (!verifyPassword) res.status(400).send("Old password invalid");

      // change password
      user.changePassword(new_password)

      return res.status(200).json({
        message: "Change password success",
        data: user,
      });

    } catch (err) {
      return res.status(400).send(err.message)
    }
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
        message: "success",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}
const userController = new UserController();
module.exports = userController;
