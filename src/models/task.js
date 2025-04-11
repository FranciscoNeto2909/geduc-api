const Sequelize = require("sequelize");
const database = require("../configs/db");

const Task = database.define("task", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate:{
        notEmpty:{
            msg:"Esse campo não pode ser vazio"
        }
    }
  },
  desc: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate:{
        notEmpty:{
            msg:"Esse campo não pode ser vazio"
        }
    }
  },
  urgency: {
    type: Sequelize.STRING(20),
    allowNull: false,
    validate:{
        notEmpty:{
            msg:"Esse campo não pode ser vazio"
        }
    }
  },
});

module.exports = Task;