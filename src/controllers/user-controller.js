const { compare } = require("bcryptjs");
const userDb = require("../db/user-db");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { env } = require("process");

module.exports = {
  async all(req, res) {
    try {
      const users = await userDb.findAll();
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },

  async one(req, res) {
    try {
      const id = req.params.id;
      const user = await userDb.findOneById(id);

      if (!user) {
        return res.status(400).json("Erro: Usuário não encontrado!");
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  async logedUsers(req, res) {
    try {
      return res.status(200).json({
        msg: "Lista de usuários",
        id_user_loged: req.userId,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async create(req, res) {
    try {
      const dados = req.body;
      const email = req.body.email;
      const userExist = await userDb.findOneByEmail(email);
      if (userExist) {
        return res
          .status(400)
          .json("Erro: Usuário já existe, use outro email!");
      }
      await userDb.create(dados);
      return res.status(200).json("Usuário criado com sucesso!");
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update(req, res) {
    try {
      const { name, lastName, email, newPassword, image, phone, rule } = req.body;
      const id = req.params.id;
      const user = await userDb.findOneById(id);

      if (!user) {
        return res.status(400).json("Erro: usuário não encontrado!");
      }

      const updateData = {};
      if (name != "") updateData.name = name;
      if (lastName != "") updateData.lastName = lastName;
      if (image != "") updateData.image = image;
      if (email != "") updateData.email = email;
      if (phone != "") updateData.phone = phone;
      if (rule != "") updateData.rule = rule;


      if (newPassword && (await compare(newPassword, user.password))) {
        return res.status(400).json({
          error: true,
          msg: "As senhas são iguais!",
        });
      } else if (newPassword && newPassword != "" && newPassword.length > 6) {
        updateData.password = newPassword;
        await userDb.update(id, updateData);
        return res.status(201).json({
          msg: "Senha atualizada!",
          error: false,
        });
      }
      await userDb.update(id, updateData);

      res.status(201).json({
        msg: "Dados atualizados!",
        error: false,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

  async updateImage(req, res) {
    try {
      const id = req.params.id;
      const user = await userDb.findOneById(id);

      if (!user) {
        return res.status(400).json("Erro: usuário não encontrado!");
      }
      if (user.image != "" && user.image != null) {
        try {
          fs.unlink(`./src/images/profile/${user.image}`, error => {
            if (error) {
              console.log("Error:" + error.message);
            }
          });
        } catch (error) {
          console.log("Error:" + error.message);
        }
      }
      if (req.file) {
        try {
          await userDb.update(id, { image: req.file.filename });

          return res.status(200).json({
            error: false,
            msg: "foto enviada!",
          });
        } catch (error) {
          return res.status(400).json({
            error: true,
            msg: "Foto não enviada!",
          });
        }
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await userDb.findOneByEmail(email);
    if (user === null) {
      return res.status(400).json({
        error: true,
        msg: "Usuario não encontrado!",
      });
    }
    if (!(await compare(password, user.password))) {
      console.log(user.password);
      return res.status(400).json({
        error: true,
        msg: "Email ou senha incorretos!",
      });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.TOKEN, {
        expiresIn: "1d",
      });

      await userDb.updateField(user.id, "isLogged", true);
      const updatedUser = await userDb.findOneById(user.id);

      return res.status(200).json({
        error: false,
        msg: "Seja bem-vindo!",
        token: token,
        userId: updatedUser.id,
        user: updatedUser,
      });
    }
  },
  async logout(req, res) {
    try {
      const id = req.params.id;
      const user = await userDb.findOneById(id);

      if (user === null) {
        return res.status(400).json({
          error: true,
          msg: "Usuário não encontrado!",
        });
      }

      await userDb.updateField(id, "isLogged", false);

      return res.status(200).json({
        error: false,
        msg: "Até a proxima!",
      });
    } catch (error) {
      return error;
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const user = await userDb.findOneById(id);

      if (!user) {
        return res.status(400).json("Erro: usuário não encontrado!");
      } else {
        if (user.image) {
          fs.unlink(`./src/images/profile/${user.image}`, error => {
            if (error) {
              console.log("Error:" + error.message);
            }
          });
        }
        await userDb.delete(id);
        res.status(201).json("usuário removido!");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
