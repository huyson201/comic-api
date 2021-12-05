require("dotenv").config();
const { Chapter, sequelize } = require("../models");
const { uploadFile, googleDrive, searchParams } = require("../util");
const { redisSetAsync, redisGetAsync } = require("../cache");
const cacheExpired = +process.env.CACHE_EXPIRE_TIME || 300;
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
    if (!chapterId) return res.status(400).send("chapter id not found");
    try {
      // const cacheKey = `cache:chapter:${chapterId}`

      // let chapter = await redisGetAsync(cacheKey)
      // if (chapter !== null) {
      //   return res.status(200).json({
      //     message: "success",
      //     data: JSON.parse(chapter),
      //   });
      // }

      let chapter = await Chapter.findByPk(chapterId);
      // await redisSetAsync(cacheKey, cacheExpired, JSON.stringify(chapter))
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
    let { offset, limit, sort } = req.query;
    let comic_id = req.params.id;
    if (!comic_id) return res.status(400).json({ err: "Comic id not found!" });
    const query = {};
    query.where = {
      comic_id: comic_id,
    };
    if (offset) query.offset = +offset;
    if (limit) query.limit = +limit;

    if (sort) {
      let col = sort.split(":")[0];
      let value = sort.split(":")[1];
      query.order = [[col, value]];
    }

    try {
      // const cacheKey = `cache:comic:${comic_id}:chapters${(offset && limit) && `:${offset}:${limit}`}`
      // let chapters = await redisGetAsync(cacheKey)
      // if (chapters !== null) {
      //   return res.status(200).json({
      //     message: "success",
      //     data: JSON.parse(chapters),
      //   })
      // }

      let chapters = await Chapter.findAndCountAll(query);
      // await redisSetAsync(cacheKey, cacheExpired, JSON.stringify(chapters))

      return res.status(200).json({
        message: "success",
        data: chapters,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async delete(req, res) {
    let chapter_id = req.params.id;
    const t = await sequelize.transaction();

    try {
      await Chapter.destroy({ where: { chapter_id } }, { transaction: t });
      t.commit();
      return res.status(204).send("deleted success");
    } catch (error) {
      console.log(error);
      t.rollback();
      return res.status(400).send(error.message);
    }
  }

  async updriver(req, res) {
    if (req.file) {
      const imgUrl = await uploadFile(req.file);
      return res
        .status(200)
        .json({ data: imgUrl, message: "Up driver successfully!" });
    }
    return res.status(200).json({ error: "Up load fail" });
  }

  async create(req, res) {
    let { comic_id, chapter_name, chapter_imgs } = req.body;
    const t = await sequelize.transaction();
    try {
      // create chapter
      let chapter = await Chapter.create(
        { comic_id, chapter_name, chapter_imgs },
        { transaction: t }
      );
      await t.commit();
      return res
        .status(200)
        .json({ data: chapter, message: "Create comic successfully!" });
    } catch (error) {
      await t.rollback();
      return res.status(400).send(error.message);
    }
  }

  async updateImgs(req, res) {
    let { chapter_name, chapter_imgs } = req.body;
    let chapter_id = req.params.id;
    const t = await sequelize.transaction();
    try {
      let chapter = await Chapter.findByPk(chapter_id);
      // const imgs = chapter.chapter_imgs.split(",")
      // imgs.forEach(e => {
      //   googleDrive.deleteFileDrive(searchParams(e).get('id'))
      // });

      await chapter.update({ chapter_name, chapter_imgs }, { transaction: t });
      await t.commit();
      return res
        .status(200)
        .json({ data: chapter, message: "Update chapter successfully!" });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(400).send(error.message);
    }
  }

  async updateImg(req, res) {
    // update chap
    let { chapter_name, chapter_imgs } = req.body;
    let chapter_id = req.params.id;
    const t = await sequelize.transaction();
    try {
      let chapter = await Chapter.findByPk(chapter_id);
      if (req.file) {
        if (chapter_imgs) {
          let fileId = searchParams(chapter_imgs).get("id");
          await googleDrive.updateFileDrive(fileId, req.file);
          let link = await googleDrive.generatePublicUrl(fileId);
          const url =
            link.data.thumbnailLink.replace(/=s(\w)*$/i, "") +
            `?id=${link.data.id}`;

          let imgs = chapter.chapter_imgs.split(",");
          if (imgs.length > 1) {
            for (let i = 0; i < imgs.length; i++) {
              if (searchParams(imgs[i]).get("id") === fileId) {
                imgs[i] = url;
              }
            }
          } else {
            imgs[0] = url;
          }
          chapter_imgs = imgs.toString();
        }
      }
      await chapter.update({ chapter_name, chapter_imgs }, { transaction: t });
      await t.commit();
      return res
        .status(200)
        .json({ data: chapter, message: "Update chapter successfully!" });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(400).send(error.message);
    }
  }

  async deleteImg(req, res) {
    const { chapter_imgs } = req.body;
    const chapter_id = req.params.id;
    const t = await sequelize.transaction();

    try {
      let chapter = await Chapter.findByPk(chapter_id);
      let fileId = searchParams(chapter_imgs).get("id");
      let imgs = chapter.chapter_imgs.split(",");
      if (imgs.length > 1) {
        for (let i = 0; i < imgs.length; i++) {
          if (searchParams(imgs[i]).get("id") == fileId) {
            imgs.splice(i, 1);
            await googleDrive.deleteFileDrive(fileId);
          }
        }
      } else {
        await googleDrive.deleteFileDrive(searchParams(imgs[0]).get("id"));
        imgs = [];
      }
      console.log(imgs);
      chapter_imgs = imgs.toString();
      await chapter.update({ chapter_imgs }, { transaction: t });
      await t.commit();
      return res
        .status(200)
        .json({ data: chapter, message: "Delete image successfully!" });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(400).send(error.message);
    }
  }
}

const chapterController = new ChapterController();
module.exports = chapterController;
