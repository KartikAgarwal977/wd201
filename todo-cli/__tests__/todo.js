/* eslint-disable no-undef */
const todoList = require("../todo");
const {
  all,
  markAsComplete,
  add,
  overdue,
  dueToday,
  dueLater,
  toDisplayableList,
} = todoList();
describe("TodoList Text Suite", () => {
  beforeAll(() => {
    add({
      title: "Submit assignment1",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
    });
  });
  const todaydate = new Date();
  test("Testing the adding element", () => {
    let initial = all.length
    add({
      title: "Submit assignment",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
    });
    expect(all.length).toBe(initial+1);
  });
  test("should have markAsComplete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("should have overdue list", () => {
    let a = overdue();
    let initial = a.length
    add({
      title: "overdue check",
      dueDate: new Date(new Date().setDate(todaydate.getDate() - 1))
        .toISOString()
        .split("T")[0],
      completed: false,
    });
    a = overdue();
    expect(a.length).toBe(initial+1);
  });
  test("should doLater", () => {
    let todaydate = new Date();
    let a = dueLater()
    let initial = a.length
    add({
      title: "due later check",
      dueDate: new Date(new Date().setDate(todaydate.getDate() + 1))
        .toISOString()
        .split("T")[0],
      completed: false,
    });
    a = dueLater();
    expect(a.length).toBe(initial + 1);
  });
  test("should be done today", () => {
    let a = dueToday();
    // here we test toDisplayableList function
    expect(toDisplayableList(a)).toBe(
      "[x] Submit assignment1 \n[ ] Submit assignment "
    );
  });
  test('check the element is add or not', () => {
    let initial = {title: "Add me",
    dueDate: new Date(new Date().setDate(todaydate.getDate() + 1))
    .toISOString()
    .split("T")[0],
    completed: false}
    add(initial)
    expect(all.includes(initial)).toBe(true)
  })
});
