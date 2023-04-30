const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { todos } = require("./models");
const path = require('path')

app.set("view engine", 'ejs')

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')))

app.get("/", async (request, response) => {
  const allTodos = await todos.getTodo();
  const dueToday = await todos.dueToday();
  const Overdue = await todos.Overdue();
  const dueLater = await todos.dueLater();

  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
      title: "Todo application",
      dueLater,
      dueToday,
      Overdue,
    });
  } else {
    response.json({
      allTodos
    });
  }
});


app.get("/todos", async (request, response) => {
  try {
    const Todo = await todos.findAll({ order: [["id", "ASC"]] });
    return response.json(Todo);
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});
app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await todos.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("create a table", request.body);
  try {
    await todos.addTodo(
     request.body.title,
    request.body.dueDate
    );
    return response.redirect("/");
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});
//change occurs on id which id we write on the link
app.put("/todos/:id/markAsCompleted", async (req, res) => {
  console.log("we have to update a todo with ID:", req.params.id);
  const Todo = await todos.findByPk(req.params.id);
  try {
    const updated = await Todo.markAsCompleted();
    return res.json(updated);
  } catch (error) {
    console.error(error);
  }
});
app.delete("/todos/:id", async (req, res) => {
  console.log("We have to delete a Todo with ID: ", req.params.id);
  const Todo = await todos.destroy({ where: { id: req.params.id } });
  res.send(Todo ? true : false);
});
module.exports = app;
