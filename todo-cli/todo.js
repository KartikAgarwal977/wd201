const todoList = () => {
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };

  var dateToday = new Date();
  const today = formattedDate(dateToday);
  let all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    let list = all.filter(i=>i.dueDate<today)
    return list;
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    let list = all.filter(i=>i.dueDate===today)
    return list;
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    let list = all.filter(i=>i.dueDate>today)
    return list;
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    const display = (item) => {
      let displaymark = item.completed ? "[x]" : "[ ]";
      let displaydate = item.dueDate === today ? "" : item.dueDate;
      return [displaymark,item.title,displaydate].join(' ')
    }
    return list.map(display).join('\n')
  };
  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

// const todos = todoList();

// todos.add({ title: 'Submit assignment', dueDate: '2023-03-11', completed: false })
// todos.add({ title: 'Pay rent', dueDate: '2023-03-12', completed: true })
// todos.add({ title: 'Service Vehicle', dueDate: '2023-03-12', completed: false })
// todos.add({ title: 'File taxes', dueDate: '2023-03-13', completed: false })
// todos.add({ title: 'Pay electric bill', dueDate: '2023-03-13', completed: false })

// console.log("My Todo-list\n")

// console.log("Overdue")
// var overdues = todos.overdue()
// var formattedOverdues = todos.toDisplayableList(overdues)
// console.log(formattedOverdues)
// console.log("\n")

// console.log("Due Today")
// let itemsDueToday = todos.dueToday()
// let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
// console.log(formattedItemsDueToday)
// console.log("\n")

// console.log("Due Later")
// let itemsDueLater = todos.dueLater()
// let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
// console.log(formattedItemsDueLater)
// console.log("\n\n")
