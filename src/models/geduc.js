const Sequelize = require("sequelize");
const database = require("../configs/db");

const Geduc = database.define("Geduc", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  phone: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  whatsapp: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  instagram: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  linkedin: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  address: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  address2: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  support: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  contact: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  commercial: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
});

module.exports = Geduc;
