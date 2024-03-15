const express = require("express");
const app = express();
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require("body-parser");
const { todos, User } = require("./models");
const path = require("path");
var csrf = require("tiny-csrf");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const flash = require("connect-flash");
var cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));
app.use(flash());
app.use(
  csrf(
    "this_should_be_32_character_long", // secret -- must be 32 bits or chars in length
    ["POST", "PUT", "DELETE"] // the request methods we want CSRF protection for
  )
);
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});
passport.use(
  new LocalStrategy(
    {
      usernameField: "Email",
      passwordField: "password",
    },
    (email, password, done) => {
      User.findOne({ where: { email: email } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid Password" });
          }
        })
        .catch(() => {
          return done(null, false, { message: "User doesn't exist" });
        });
    }
  )
);
app.use(helmet());
app.use(helmet({
  contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        "script-src": ["'self'", "cdn.tailwindcss.com"],  
      },
  },
}));


passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  if (request.user) {
    response.redirect("/todos");
  } else {
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
  }
});
app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const loggedInuser = request.user.id;
    // const allTodos = await todos.getTodo(loggedInuser);
    const account = await User.findByPk(loggedInuser);
    const username = `${account.firstName} ${account.lastName}`;
    const dueToday = await todos.dueToday(loggedInuser);
    const Overdue = await todos.Overdue(loggedInuser);
    const dueLater = await todos.dueLater(loggedInuser);
    const completed = await todos.todocompleted(loggedInuser);
    if (request.accepts("html")) {
      response.render("todo", {
        // allTodos,
        title: "Todo application",
        dueLater,
        dueToday,
        Overdue,
        completed,
        username,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        // allTodos,
        dueLater,
        dueToday,
        Overdue,
        username,
        completed,
        csrfToken: request.csrfToken(),
      });
    }
  }
);

app.get("/signup", async (req, res) => {
  if (req.user) {
    res.redirect("/todos");
  } else {
    res.render("signup", {
      title: "Sign Up",
      csrfToken: req.csrfToken(),
    });
  }
});

app.get("/login", async (req, res) => {
  if (req.user) {
    res.redirect("/todos");
  } else {
    res.render("login", {
      title: "Login",
      csrfToken: req.csrfToken(),
    });
  }
});
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (request, response) => {
    // console.log(request.user);
    response.redirect("/todos");
  }
);

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.post("/users", async (req, res) => {
  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
  console.log(hashedPwd);
  console.log(`firstName ${req.body.FirstName}`);
  if (req.body.FirstName == "") {
    req.flash("error", "First name is required");
    return res.redirect("/signup");
  }
  if (req.body.Email == "") {
    req.flash("error", "email is required");
    return res.redirect("/signup");
  }
  if (req.body.password.length < 8) {
    req.flash("error", "password atleast of 8 character");
    return res.redirect("/signup");
  }
  try {
    const user = await User.create({
      firstName: req.body.FirstName,
      lastName: req.body.LastName,
      email: req.body.Email,
      password: hashedPwd,
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      }

      res.redirect("/todos");
    });
  } catch (error) {
    req.flash("error", "Email already exist");
    console.log(error);
    return res.redirect("/signup");
  }
});

app.get(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await todos.findByPk(request.params.id);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    if (request.body.title == "") {
      request.flash("error", "Todo must have a title");
      return response.redirect("/todos");
    }
    if (request.body.dueDate == "") {
      request.flash("error", "Todo must have a due date");
      return response.redirect("/todos");
    }

    console.log("create a table", request.body);
    try {
      await todos.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.error(error);
      return response.status(422).json(error);
    }
  }
);
//change occurs on id which id we write on the link for mark complete or incomplete
app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  console.log("we have to update a todo with ID:", req.params.id);
  const Todo = await todos.findByPk(req.params.id);
  if (Todo.userId === req.user.id) {
    try {
      const updatedTodo = await Todo.setCompletionStatus(req.body.completed);
      return res.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  } else {
    return res
      .status(403)
      .json({ error: "You are not authorized to update this todo" });
  }
});
app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    console.log("We have to delete a Todo with ID: ", req.params.id);
    try {
      await todos.remove(req.params.id, req.user.id);
      const check = await todos.findByPk(req.params.id);
      if (check) {
        return res.json({ success: false });
      }
      return res.json({ success: true });
    } catch (error) {
      return res.status(422).json(error);
    }
  }
);
module.exports = app;
