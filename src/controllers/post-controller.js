const Post = require("../models/post");
const User = require("../models/user");

const fs = require("fs");
const path = require("path");

module.exports = {
  async all(req, res) {
    try {
      const posts = await Post.findAll();
      res.status(200).json(posts);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  async one(req, res) {
    try {
      const id = req.params.id;
      const post = await Post.findOne({ where: { id } });
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

      const postExists = await Post.findOne({ where: { title } });

      if (postExists) {
        return res.status(400).json({
          erro: true,
          msg: "Esse post já existe!",
        });
      }

      const createdPost = await Post.create({
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
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ msg: "Usuário não autorizado!" });
      }

      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ msg: "Postagem não encontrada!" });
      }

      const { title, subtitle, text } = req.body;

      await post.update({
        title,
        subtitle,
        text,
      });

      if (req.file) {
        if (post.image) {
          const imagePath = path.join(
            __dirname,
            "../images/posts/",
            post.image,
          );
          await fs.promises.unlink(imagePath).catch(() => {});
        }

        await post.update({
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
      const post = await Post.findOne({ where: { id } });

      if (!post) {
        return res.status(400).json("Postagem não encontrada!");
      }

      const imagePath = path.join(__dirname, "../images/posts/", post.image);
      await fs.promises.unlink(imagePath);

      await post.destroy();
      await post.save();

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
