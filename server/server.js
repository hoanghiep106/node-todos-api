const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({todos});
    }, e => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        Todo.findById(req.params.id).then(todo => {
            if(!todo) res.status(404).send({message: 'Todo not found'});
            else res.send({todo});
        }, e => {
            res.status(400).send(e)
        });
    } else res.status(400).send({message: 'Todo id not valid'});
});

app.delete('/todos/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        Todo.findByIdAndRemove(req.params.id).then(todo => {
            if(!todo) res.status(404).send({message: 'Todo not found'});
            else res.send({todo});
        }, e => {
            res.status(400).send(e)
        });
    } else res.status(400).send({message: 'Todo id not valid'});
});

app.patch('/todos/:id', (req, res) => {
    const body = {};
    if(req.body.text) body.text = req.body.text;
    if(req.body.completed) body.completed = req.body.completed;
    if(ObjectId.isValid(req.params.id)) {
        if(typeof body.completed === 'boolean' && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }
        Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then(todo => {
            if(!todo) res.status(404).send({message: 'Todo not found'});
            res.send({todo});
        }).catch(e => {
            res.send(400).send({message: 'Todo id not valid'});
        });
    } else res.status(400).send({message: 'Todo id not valid'});
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};