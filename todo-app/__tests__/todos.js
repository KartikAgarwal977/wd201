const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio");
let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
const login = async (agent, Email, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    Email: Email,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });
  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      _csrf: csrfToken,
      firstName: "Test",
      lastName: "User 1",
      email: "user1@test.com",
      password: "password",
    });
    expect(res.statusCode).toBe(302);
  });
  
  test("Sign out ", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200)
    res = await agent.get('/signout')
    expect(res.status).toBe(302);
    res = await agent.get('/todos');
    expect(res.status).toBe(302);
  })
  
  
  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "user1@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
    });
    
  test("Marks a todo with the given ID as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "user1@test.com", "password");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedtodoResponse = await agent
    .get("/todos")
    .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedtodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    const status = true
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const markAsCompleted = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: status,
    });
    const parseUpdateResponse = JSON.parse(markAsCompleted.text);
    expect(parseUpdateResponse.completed).toBe(true);
  });
  
  test("Marks a todo with the given ID as Incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "user1@test.com", "password");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: true,
      _csrf: csrfToken,
    });
    
    const groupedtodoResponse = await agent
    .get("/todos")
    .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedtodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    const status = false
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const markAsCompleted = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: status,
    });
    const parseUpdateResponse = JSON.parse(markAsCompleted.text);
    expect(parseUpdateResponse.completed).toBe(false);
  });
  
  test("Deletes a todo using /todos/:id endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "user1@test.com", "password");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post('/todos').send({
      title: "to remove",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken
    });
    const groupedtodoResponse = await agent
    .get("/todos")
    .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedtodoResponse.text);
    
    expect(parsedGroupedResponse.dueToday).toBeDefined();
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    
    res = await agent.get('/todos')
    csrfToken = extractCsrfToken(res);
    
    const deletedResponse = await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });
    expect(deletedResponse.statusCode).toBe(200)
  });
  
  // test("Fetches all todos in the database using /todos endpoint", async () => {
    //   var response = await agent.get("/todos");
    //   var res = await agent.get('/')
    //   var parsedResponse = JSON.parse(response.text);
    //   var previous = parsedResponse.length;
    //   let csrfToken = extractCsrfToken(res);
    //   await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     "_csrf": csrfToken
  //   });
  //   await agent.post("/todos").send({
  //     title: "Buy ps3",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     "_csrf": csrfToken
  //   });
  //   response = await agent.get("/todos");
  //   parsedResponse = JSON.parse(response.text);

  //   expect(parsedResponse.length).toBe(previous);
  //   // expect(parsedResponse[parsedResponse.length - 1]["title"]).toBe("Buy milk");
  // });

});
