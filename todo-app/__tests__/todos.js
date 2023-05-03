const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const cheerio = require('cheerio')
let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text)
  return $("[name=_csrf]").val();
}
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

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get('/');
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    });
    expect(response.statusCode).toBe(302);
    // expect(response.header["content-type"]).toBe(
    //   "application/json; charset=utf-8"
    // );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res = await agent.get('/');
    let csrfToken = extractCsrfToken(res);
    // const response = await agent.post("/todos").send({
    //   title: "Buy milk",
    //   dueDate: new Date().toISOString(),
    //   completed: false,
    //   "_csrf": csrfToken
    // });
    
    const groupedtodoResponse = await agent
      .get('/')
      .set('Accept', 'application/json');
    const parsedGroupedResponse = JSON.parse(groupedtodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[(dueTodayCount - 1)]
    
    res = await agent.get('/')
    csrfToken = extractCsrfToken(res)
    const markAsCompleted = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    })
    const parseUpdateResponse = JSON.parse(markAsCompleted.text)
    expect(parseUpdateResponse.completed).toBe(true)

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

  // test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //   // FILL IN YOUR CODE HERE
  //   const res = await agent.post("/todos").send({
  //     title: "to delete",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const parsedResponse = JSON.parse(res.text);
  //   const todoID = parsedResponse.id;

  //   const deleteTodores = await agent.delete(`/todos/${todoID}`).send();
  //   const parsedDeleteResponse = JSON.parse(deleteTodores.text);
  //   expect(parsedDeleteResponse).toBe(true);
  // });
});
