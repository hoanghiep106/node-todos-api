const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then(result => {
//     console.log(result);
// });

Todo.findByIdAndRemove('59b532abae2e09fb4dedab9b').then(todo => {
    console.log(todo);
});