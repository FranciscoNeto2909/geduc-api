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
        return res.status(404).json("Postagem não encontrada!");
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
      const user = await userDb.findOneById(req.userId);
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
      }

      if (user.rule !== "Admin") {
        return res.status(403).json({ msg: "Usuário não autorizado!" });
      }

      if (postExists) {
        return res.status(400).json({
          error: true,
          msg: "Esse post já existe!",
        });
      }

      const createdPost = await postDb.create({
        title,
        ...rest,
        image: req.file ? req.file.filename : null,
      });

      return res.status(201).json({
        error: false,
        msg: "Postagem adicionada ao blog!",
        id: createdPost.id,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: true,
        msg: "Faltam dados ou erro interno",
      });
    }
  },

  async createFromMaker(req, res) {
    try {
      const apiKey = req.headers['x-api-key'];
  
      if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({
          error: true,
          msg: "Acesso negado: API Key inválida",
        });
      }
  
      const { title, ...rest } = req.body;
  
      const postExists = await postDb.findOneByTitle(title);
  
      if (postExists) {
        return res.status(400).json({
          error: true,
          msg: "Esse post já existe!",
        });
      }
  
      const createdPost = await postDb.create({
        title,
        ...rest,
        image: req.file ? req.file.filename : null,
      });
  
      return res.status(200).json({
        error: false,
        msg: "Postagem adicionada ao blog!",
        id: createdPost.id,
      });
  
    } catch (error) {
      return res.status(500).json({
        error: true,
        msg: "Erro interno no servidor",
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

      const { title, subtitle, text, rule, isDeleted } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      if (text !== undefined) updateData.text = text;
      if (rule !== undefined) updateData.rule = rule;
      if (isDeleted !== undefined) {
        updateData.isDeleted =
          isDeleted === true ||
          isDeleted === "true" ||
          isDeleted === 1 ||
          isDeleted === "1"
            ? 1
            : 0;
      }

      if (Object.keys(updateData).length === 0 && !req.file) {
        return res.status(400).json({
          error: true,
          msg: "Nenhum dado foi enviado para atualizacao.",
        });
      }

      if (Object.keys(updateData).length > 0) {
        await postDb.update(id, updateData);
      }

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
      const user = await userDb.findOneById(req.userId);

      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
      }
      if (!post) {
        return res.status(404).json("Postagem não encontrada!");
      }

      if (user.rule !== "Admin") {
        return res.status(403).json({ msg: "Usuário não autorizado!" });
      }

      if (post.image) {
        const imagePath = path.join(__dirname, "../images/posts/", post.image);
        await fs.promises.unlink(imagePath).catch(() => {});
      }

      await postDb.delete(id);

      return res.status(200).json({
        error: false,
        msg: "Postagem apagada!",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
