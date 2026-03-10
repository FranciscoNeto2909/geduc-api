const postDb = require("../db/post-db");
const userDb = require("../db/user-db");

const fs = require("fs");
const path = require("path");

module.exports = {
  async all(req, res) {
    try {
      const posts = await postDb.findAll();
      res.status(200).json(posts);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  async one(req, res) {
    try {
      const id = req.params.id;
      const post = await postDb.findOneById(id);
      if (!post) {
        return res.status(400).json("Tarefa não encontrada!");
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  async create(req, res) {
    try {
      const { title, ...rest } = req.body;

      const postExists = await postDb.findOneByTitle(title);

      if (postExists) {
        return res.status(400).json({
          erro: true,
          msg: "Esse post já existe!",
        });
      }

      const createdPost = await postDb.create({
        title,
        ...rest,
        image: req.file ? req.file.filename : null,
      });

      return res.status(201).json({
        erro: false,
        msg: "Postagem adicionada ao blog!",
        id: createdPost.id,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        erro: true,
        msg: "Faltam dados ou erro interno",
        detalhe: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const user = await userDb.findOneById(req.userId);
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
      }

      if (user.rule !== "Admin") {
        return res.status(403).json({ msg: "Usuário não autorizado!" });
      }

      const post = await postDb.findOneById(id);
      if (!post) {
        return res.status(404).json({ msg: "Postagem não encontrada!" });
      }

      const { title, subtitle, text, rule } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      if (text !== undefined) updateData.text = text;
      if (rule !== undefined) updateData.rule = rule;

      await postDb.update(id, updateData);

      if (req.file) {
        if (post.image) {
          const imagePath = path.join(
            __dirname,
            "../images/posts/",
            post.image,
          );
          await fs.promises.unlink(imagePath).catch(() => {});
        }

        await postDb.update(id, {
          image: req.file.filename,
        });
      }

      return res.status(200).json({
        error: false,
        msg: "Postagem atualizada!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Erro interno do servidor" });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      const post = await postDb.findOneById(id);

      if (!post) {
        return res.status(400).json("Postagem não encontrada!");
      }

      if (post.image) {
        const imagePath = path.join(__dirname, "../images/posts/", post.image);
        await fs.promises.unlink(imagePath).catch(() => {});
      }

      await postDb.delete(id);

      return res.status(201).json({
        erro: false,
        msg: "Postagem apagada!",
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
};
