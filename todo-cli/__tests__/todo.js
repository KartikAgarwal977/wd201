/* eslint-disable no-undef */
const todoList = require('../todo')
const { all, markAsComplete, add } = todoList()
describe('TodoList Text Suite', () => {
  beforeAll(() => {
    add({
      title: 'Submit assignment1', dueDate: new Date().toISOString().slice(0, 10), completed: false
    })
  })
  test('should have empty todo list initially', () => {
    expect(all.length).toBe(1)
    add({
      title: 'Submit assignment', dueDate: new Date().toISOString().slice(0, 10), completed: false
    })
    expect(all.length).toBe(2)
  })
  test('should have markAsComplete', () => {
    expect(all[0].completed).toBe(false)
    markAsComplete(0)
    expect(all[0].completed).toBe(true)
  })
})
