"use strict";
const { Model } = require("sequelize");
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
    }
    static addTodo(title, dueDate) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }
    markAsCompleted() {
      return this.update({ completed: true });
    }
    static async getTodo() {
      return await this.findAll()
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
