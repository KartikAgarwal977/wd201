const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { todos, User } = require("./models");
const path = require("path");
var csrf = require("tiny-csrf");
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const saltRounds = 10 ;
var cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));
app.use(
  csrf(
    "this_should_be_32_character_long", // secret -- must be 32 bits or chars in length
    ["POST", "PUT", "DELETE"] // the request methods we want CSRF protection for
  )
);
app.use(session({
  secret: "secret-key-874009116946977",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
})
)
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
}, (email, password, done) => {
  User.findOne({ where: { email: email } })
    .then(async(user) => {
      const result = await bcrypt.compare(password, user.password)
      if (result) {
        return done(null, user)
      }
      else {
        return done("Invalid Password");
        }
    }).catch((error) => {
      return done(error)
    }) 
}))
passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
})
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      return done(null, user)
    })
    .catch((error) => {
      done(error, null)
    })
  })

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  if (request.accepts("html")) {
    response.render("index", {
      title: "Todo application",
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      csrfToken: request.csrfToken(),
    });
  }
});
app.get('/todos', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  const allTodos = await todos.getTodo();
  const dueToday = await todos.dueToday();
  const Overdue = await todos.Overdue();
  const dueLater = await todos.dueLater();
  const completed = await todos.todocompleted();
  if (request.accepts("html")) {
    response.render("todo", {
      allTodos,
      title: "Todo application",
      dueLater,
      dueToday,
      Overdue,
      completed,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
      dueLater,
      dueToday,
      Overdue,
      csrfToken: request.csrfToken(),
    });
  }
});


app.get("/signup", async (req, res) => {
  res.render('signup', {
    title: "Sign Up",
    csrfToken: req.csrfToken(),
})

})

app.get("/login", async (req, res) => {
  res.render('login', {
    title: "Login",
    csrfToken: req.csrfToken(),
  })
})
app.post("/session", passport.authenticate('local', { failureRedirect: "/login", failureFlash: true,}), async (request, response) => {
  console.log(request.user);
  response.redirect("/todos");
})


app.post('/users', async (req, res) => {
  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds)
  console.log(hashedPwd)
  console.log(`firstName ${req.body.FirstName}`)
  try {
    const user = await User.create({
      firstName: req.body.FirstName,
      lastName: req.body.LastName,
      email: req.body.Email,
      password: hashedPwd    
    })
    req.login(user, (err) => {
      if (err) {
        console.log(err)
      }
      res.redirect('/todos')
    })
  }
  catch(error) {
    console.error(error)
  }
})

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
    await todos.addTodo(request.body.title, request.body.dueDate);
    return response.redirect("/");
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});
//change occurs on id which id we write on the link for mark complete or incomplete
app.put("/todos/:id", async (req, res) => {
  console.log("we have to update a todo with ID:", req.params.id);
  const Todo = await todos.findByPk(req.params.id);
  try {
    const updated = await Todo.setCompletionStatus(req.body.completed);
    return res.json(updated);
  } catch (error) {
    console.error(error);
  }
});
app.delete("/todos/:id", async (req, res) => {
  console.log("We have to delete a Todo with ID: ", req.params.id);
  try {
    await todos.remove(req.params.id);
    res.json({ success: true });
  } catch (error) {
    return res.status(422).json(error);
  }
});
module.exports = app;
