const { connect } = require('./connectDB.js');
const Todo = require('./TodoModel.js');
const createTodo = async () => {
    try {
        await connect();
        const todo = await Todo.addTask({
            title: 'second Item',
            dueDate: new Date(),
            completed: false,
        });
        console.log(`Created todo with ID : ${todo.id}`);
        
    } catch (error) {
        console.error(error);
    }
}
const countItems = async () => {
    try {
        const totalcount = await Todo.count();
        console.log(`Found ${totalcount} items in the table!`);
    } catch (error) {
        console.error(error);
    }
}
const getsingleTodos = async () => {
    try {
        const todo = await Todo.findOne({
            where: {
                completed: false
            },
            order: [['id', 'DESC']]
        });
        console.log(todo.displayablestring())
    } catch (error) {
        console.error(error)
    }
}
const updateitem = async (id) => {
    try {
        await Todo.update({ completed: true }, {
            where: {
                id: id
            },
            
        })
    } catch (error) {
        console.error(error)
    }
}
const deleteditem = async (id) => {
    try {
        const item = await Todo.destroy({
            where: {
                id:id
            }
        })
        console.log(`the deleted item is ${item}`)
    } catch(error) {
        console.error(error)
    }
}
const getAllTodos = async () => {
    try {
        const todos = await Todo.findAll({
            
            order: [['id', 'DESC']]
        });
        let todolist = todos.map(todo => todo.displayablestring()).join('\n');
        console.log(todolist)

    } catch (error) {
        console.error(error)
    }
}
(async () => {
    await createTodo();
    await countItems();
    await getAllTodos();
    await getsingleTodos();
    await updateitem(2);
    await deleteditem(1);
    await getAllTodos();
})();
