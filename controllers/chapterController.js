const { Chapter, sequelize } = require("../models");
const { uploadFile, googleDrive, searchParams } = require('../util');
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

  async delete(req, res) {
    let chapter_id = req.params.id
    const t = await sequelize.transaction()

    try {
      await Chapter.destroy({ where: { chapter_id } }, { transaction: t })
      t.commit()
      return res.status(204).send("deleted success")
    } catch (error) {
      console.log(error)
      t.rollback()
      return res.status(400).send(error.message)
    }
  }

  async create(req, res) {
    let { comic_id, chapter_name } = req.body
    const t = await sequelize.transaction()
    try {
      let imgs = []
      if (req.files) {
        for (let file of req.files) {
          console.log(file);
          const imgUrl = await uploadFile(file)
          imgs.push(imgUrl)
        }
      }
      const chapter_imgs = imgs.toString()
      console.log(chapter_imgs);
      // create chapter
      let chapter = await Chapter.create({ comic_id, chapter_name, chapter_imgs }, { transaction: t })
      await t.commit()
      return res.status(200).json({ data: chapter, message: "Create comic successfully!" })
    } catch (error) {
      await t.rollback()
      return res.status(400).send(error.message)
    }
  }

  async updateImg(req, res) {
    let { data, old_img } = req.body
    let chapter_id = req.params.id
    const temp = old_img
    const t = await sequelize.transaction()
    try {
      let chapter = await Chapter.findByPk(chapter_id)
      //upload chap img
      if (req.file) {
        if (old_img) {
          let fileId = searchParams(old_img).get('id')
          googleDrive.updateFileDrive(fileId, req.file)
          data.chapter_img = chapter.chapter_imgs.replace(temp, old_img)
        }
        else {
          let imgUrl = await uploadFile(req.file)
          data.chapter_img = chapter.chapter_imgs + ',' + imgUrl
        }
        console.log(old_img, "old img");
        console.log(temp, "temp");
      }
      // update chap
      await chapter.update({ ...data }, { transaction: t })
      await t.commit()
      return res.status(200).json({ data: comic, message: "Update comic successfully!" })

    } catch (error) {
      console.log(error)
      await t.rollback()
      return res.status(400).send(error.message)
    }
  }


}

const chapterController = new ChapterController();
module.exports = chapterController;
