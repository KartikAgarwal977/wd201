// models/todo.js
'use strict';
const { Model } = require('sequelize');
const { Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todos.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdue_element = await this.overdue();
      const overdue_list = overdue_element.map((i) => i.displayableString())
      console.log(overdue_list.join('\n').trim())
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const today_element = await this.dueToday()
      const today_list = today_element.map((i) => i.displayableString())
      console.log(today_list.join('\n').trim())
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const due_later_element = await this.dueLater()
      const due_later_list = due_later_element.map((i) => i.displayableString())
      console.log(due_later_list.join('\n').trim())

    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const overdue = Todos.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),

          }
        },
        order:[['id','ASC']],
      })
      return overdue
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const dueToday = Todos.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),

          }
        },
        order:[['id','ASC']],
      })
      return dueToday
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const dueLater = Todos.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),

          }
        },
        order:[['id','ASC']],
      })
      return dueLater
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todos.update({ completed: true }, {
        where: {
          id: id,
        }
      })
    }

    displayableString() {
      let today_checker = new Date(this.dueDate)
      let checkbox = this.completed ? "[x]" : "[ ]";
      return today_checker.getDate() === new Date().getDate() ?
      `${this.id}. ${checkbox}  ${this.title} `: new Date`${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todos.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todos;
};