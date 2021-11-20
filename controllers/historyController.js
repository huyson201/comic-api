require("dotenv").config();
const { History, sequelize,Chapter } = require("../models");

class HistoryController {
  async index(req, res) {
    let { user_uuid, comic_id } = req.query;
    const query = { where: {} };
    if (user_uuid) query.where.user_uuid = user_uuid;
    if (comic_id) query.where.comic_id = +comic_id;
    try {
      let histories = await History.findAndCountAll(query);
      return res.status(200).json({
        code: 200,
        name: "",
        message: "success",
        data: histories,
      });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  async create(req, res) {
    let { comic_id, chapters } = req.body;
    let query = {};
    query.subQuery = false;
    query = {
      attributes: ["chapter_name"],
      through: {
        attributes: [],
      },
    };
    let user_uuid = req.user.user_uuid;
    const t = await sequelize.transaction();
    try {
      let chapter = await Chapter.findByPk(chapters, query);
      let reading_chapter_name = chapter.chapter_name
      let existHistory = await History.findOne({
        where: { user_uuid, comic_id },
      });
      if (existHistory) {
        let arrChapters = existHistory.chapters.split(",").map(Number);
        const index = arrChapters.indexOf(chapters);
        if (index !== -1) {
          arrChapters.splice(index, 1);
        }
        arrChapters.push(+chapters);
        chapters = arrChapters.toString();
        await existHistory.update({ chapters,reading_chapter_name }, { transaction: t });
        await t.commit();
        return res.status(200).json({
          code: "",
          name: "UPDATED_HISTORY",
          message: "success",
          data: existHistory,
        });
      }
      else{
        let history = await History.create({ user_uuid, comic_id, chapters,reading_chapter_name });
        return res.status(201).json({
          code: 201,
          name: "CREATED_HISTORY",
          message: "created success ",
          data: history,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
}

const historyController = new HistoryController();
module.exports = historyController;
