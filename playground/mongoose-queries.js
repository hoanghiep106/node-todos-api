const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var id = '59b1eef79e97100be4a0f258';

// if(!ObjectId.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then(todos => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then(todo => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then(todo => {
//     if(!todo) {
//         return console.log('Id not found')
//     }
//     console.log('Todo by id', todo)
// }).catch(e => {
//     console.log(e)
// });

User.findById(id).then(user => {
    if(!user) {
        return console.log('User not found')
    }
    console.log('User by id', JSON.stringify(user, undefined, 2));
}).catch(e => console.log(e));