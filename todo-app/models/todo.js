"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
      todos.belongsTo(models.User, {
        foreignKey: "userId"
      })
    }
    static addTodo(title, dueDate) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    setCompletionStatus(status) {
      return this.update({ completed: status });
    }
    static async getTodo() {
      return await this.findAll();
    }
    static async dueToday() {
      return await this.findAll({
        where: {
          dueDate: { [Op.eq]: new Date() },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async Overdue() {
      return await this.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async dueLater() {
      return await this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async todocompleted() {
      return await this.findAll({
        where: {
          completed: true,
        },
      });
    }
    static async remove(id) {
      return await this.destroy({ where: { id } });
    }
  }
  todos.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "todos",
    }
  );
  return todos;
};
