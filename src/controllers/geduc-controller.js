const geducDb = require("../db/geduc-db");
const userDb = require("../db/user-db");

module.exports = {
  async one(req, res) {
    try {
      const geduc = await geducDb.findOneById(1);
      if (!geduc) {
        return res.status(400).json({ msg: "nada ainda" });
      }
      res.status(200).json(geduc);
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },

  async create(req, res) {
    const geduc = await geducDb.findOneById(1);
    if (geduc) {
      return res.status(400).json({ msg: "Já existem dados" });
    }

    try {
      await geducDb.create({
        phone: "99984538839",
        instagram: "https://www.instagram.com/geduc.educacao",
        linkedin: "https://www.linkedin.com/company/geduc-solu%C3%A7%C3%B5es/",
        whatsapp: "85994323201",
        address: "https://maps.app.goo.gl/eb1JhT3bZSvBdA8h9",
        address2: "https://maps.app.goo.gl/uNcwA8Gaw2BBubMv8",
        support: "suporte@genesistech.com.br",
        contact: "contato@genesistech.com.br",
        commercial: "comercial@genesistech.com.br",
      });

      return res.status(201).json({
        erro: false,
        msg: "dados da empresa criados!",
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
      const user = await userDb.findOneById(req.userId);
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
      }

      if (!user.rule === "Admin") {
        return res.status(403).json({ msg: "Usuário não autorizado!" });
      }

      const geduc = await geducDb.findOneById(1);
      if (!geduc) {
        return res
          .status(404)
          .json({ msg: "atualização de dados autorizado!" });
      }

      const {
        phone,
        instagram,
        whatsapp,
        linkedin,
        address,
        address2,
        support,
        commercial,
        contact,
      } = req.body;

      await geducDb.update(1, {
        phone,
        instagram,
        whatsapp,
        linkedin,
        address,
        address2,
        support,
        commercial,
        contact,
      });

      return res.status(200).json({
        error: false,
        msg: "Dados atualizados!",
      });
    } catch (error) {
      return res.status(500).json({ msg: "Erro interno do servidor" });
    }
  },
};
