require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate')


const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then(doc => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then(todos => {
        res.send({todos});
    }, e => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        Todo.findOne({
            _id: req.params.id, 
            _creator: req.user._id
        }).then(todo => {
            if(!todo) res.status(404).send({message: 'Todo not found'});
            else res.send({todo});
        }, e => {
            res.status(400).send(e)
        });
    } else res.status(400).send({message: 'Todo id not valid'});
});

app.delete('/todos/:id', authenticate, (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        Todo.findOneAndRemove({
            _id: req.params.id, 
            _creator: req.user._id
        }).then(todo => {
            if(!todo) res.status(404).send({message: 'Todo not found'});
            else res.send({todo});
        }, e => {
            res.status(400).send(e)
        });
    } else res.status(400).send({message: 'Todo id not valid'});
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
        Todo.findOneAndUpdate({
            _id: req.params.id, 
            _creator: req.user._id
        }, {$set: body}, {new: true}).then(todo => {
            if(!todo) res.status(404).send({message: 'Todo not found'});
            res.send({todo});
        }).catch(e => {
            res.status(400).send({message: 'Todo id not valid'});
        });
    } else res.status(400).send({message: 'Todo id not valid'});
});

app.post('/users', (req, res) => {
    const body = {};
    if(req.body.email) body.email = req.body.email;
    if(req.body.password) body.password = req.body.password;
    const user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    User.findByCredentials(req.body.email, req.body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        })
    }).catch(e => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};