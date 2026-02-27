const Sequelize = require("sequelize");
const database = require("../configs/db");

const Post = database.define("Post", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull:true,
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
  subtitle: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio",
      },
    },
  },
});

module.exports = Post;
