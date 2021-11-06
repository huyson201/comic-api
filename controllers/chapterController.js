const { Chapter } = require("../models");

class ChapterController {
  async index(req, res) {
    let { limit, offset, sort } = req.query;
    const query = {};


    if (limit) query.limit = +limit;
    if (offset) query.offset = +offset;

    if (sort) {
      let col = sort.split(":")[0];
      let value = sort.split(":")[1];
      query.order = [[col, value]];
    }

    try {
      let chapters = await Chapter.findAll();

      return res.status(200).json({
        message: "success",
        data: chapters,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async getById(req, res) {
    let chapterId = req.params.id;
    if (!chapterId) return res.status(400).send('chapter id not found');
    try {
      let chapter = await Chapter.findByPk(chapterId);
      return res.status(200).json({
        message: "success",
        data: chapter,
      });
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  async getByComicId(req, res) {
    let { offset, limit, sort } = req.query
    let comic_id = req.params.id
    if (!comic_id) return res.status(400).json({ err: "Comic id not found!" })
    const query = {}
    query.where = {
      comic_id: comic_id
    }
    if (offset) query.offset = +offset
    if (limit) query.limit = +limit

    if (sort) {
      console.log(sort, "sort");
      let col = sort.split(':')[0]
      let value = sort.split(':')[1]
      query.order = [[col, value]]
    }

    try {
      let chapters = await Chapter.findAndCountAll(query)
      return res.status(200).json({
        message: "success",
        data: chapters,
      })
    }
    catch (err) {
      console.log(err)
      return res.status(400).send(err.message)
    }
  }
}

const chapterController = new ChapterController();
module.exports = chapterController;
