const Sequelize = require("sequelize");
const database = require("../configs/db");

const Blog = database.define("Blog", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  Text1: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  Text2: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
});

module.exports = Blog;
