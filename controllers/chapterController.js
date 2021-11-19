require('dotenv').config()
const { Chapter, sequelize } = require("../models");
const { uploadFile, googleDrive, searchParams } = require('../util');
const { redisSetAsync, redisGetAsync } = require('../cache')
const cacheExpired = +process.env.CACHE_EXPIRE_TIME || 300
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
      const cacheKey = `cache:chapter:${chapterId}`

      let chapter = await redisGetAsync(cacheKey)
      if (chapter !== null) {
        return res.status(200).json({
          message: "success",
          data: JSON.parse(chapter),
        });
      }

      chapter = await Chapter.findByPk(chapterId);
      await redisSetAsync(cacheKey, cacheExpired, JSON.stringify(chapter))
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
      const cacheKey = `cache:comic:${comic_id}:chapters${(offset && limit) && `:${offset}:${limit}`}`
      let chapters = await redisGetAsync(cacheKey)
      if (chapters !== null) {
        return res.status(200).json({
          message: "success",
          data: JSON.parse(chapters),
        })
      }

      chapters = await Chapter.findAndCountAll(query)
      await redisSetAsync(cacheKey, cacheExpired, JSON.stringify(chapters))

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
    let { chapter_name, chapter_imgs } = req.body
    let chapter_id = req.params.id
    // const temp = old_img
    const t = await sequelize.transaction()
    console.log("file file file ne", req.files);
    try {
      let chapter = await Chapter.findByPk(chapter_id)
      // upload img
      let imgsUrl = []
      if (req.files) {
        for (let img of req.files) {
          let result = await uploadFile(img)
          imgsUrl.push(result)
        }
      }
      if (imgsUrl.length > 0) chapter_imgs = imgsUrl.toString()
      await chapter.update({ chapter_name, chapter_imgs }, { transaction: t })
      await t.commit()
      return res.status(200).json({ data: chapter, message: "Update chapter successfully!" })
    } catch (error) {
      console.log(error)
      await t.rollback()
      return res.status(400).send(error.message)
    }
    // await chapter.update(data)

    // //upload chap img
    // if (req.file) {
    //   if (old_img) {
    //     let fileId = searchParams(old_img).get('id')
    //     googleDrive.updateFileDrive(fileId, req.file)
    //     data.chapter_img = chapter.chapter_imgs.replace(temp, old_img)
    //   }
    //   else {
    //     let imgUrl = await uploadFile(req.file)
    //     data.chapter_img = chapter.chapter_imgs + ',' + imgUrl
    //   }
    //   console.log(old_img, "old img");
    //   console.log(temp, "temp");
    // }
    // update chap
  }


}

const chapterController = new ChapterController();
module.exports = chapterController;
