const request = require('supertest');
const expect = require('expect');
const {ObjectId} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', done => {
        let text = 'Test text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done()
                }).catch(e => done(e));
            });
    });

    it('should not create todo with invalid body data', done => {
        let text = '';
        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end((err, res) => {
                if(err) return done(err);
                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo item', done => {
        request(app)
            .get('/todos/' + todos[0]._id.toHexString())
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', done => {
        request(app)
        .get('/todos/' + (new ObjectId).toHexString())
        .expect(404)
        .expect((res) => {
            expect(res.body.message).toBe('Todo not found');
        })
        .end(done);
    });

    it('should return 400 if id is invalid', done => {
        request(app)
            .get('/todos/' + '123')
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe('Todo id not valid');
            })
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove todo item', done => {
        let hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err) return done(err)
                Todo.findById(hexId).then(todo => {
                    console.log(todo)
                    expect(todo).toBe(null);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .delete('/todos/' + (new ObjectId).toHexString())
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe('Todo not found');
            })
            .end(done);
    });

    it('should return 400 if id is invalid', done => {
        request(app)
            .delete('/todos/' + '123')
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe('Todo id not valid');
            })
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        const updatedTodo = {
            text: 'New test',
            completed: true
        }
        request(app)
            .patch('/todos/' + todos[0]._id.toHexString())
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(updatedTodo.text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeTruthy();
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.findById(todos[0]._id.toHexString()).then(todo => {
                    expect(todo.text).toBe(updatedTodo.text);
                    expect(todo.completed).toBe(true);
                    expect(todo.completedAt).toBeTruthy();
                    done();
                }).catch(e => done(e));
            });
    });

    it('should clear completedAt when todo is not completed', done => {
        const updatedTodo = {
            text: 'New test',
            completed: false
        }
        request(app)
            .patch('/todos/' + todos[1]._id.toHexString())
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(updatedTodo.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.findById(todos[1]._id.toHexString()).then(todo => {
                    expect(todo.text).toBe(updatedTodo.text);
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toBeFalsy();
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should reuturn 401 id not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create an user', done => {
        let email = 'example@gmail.com';
        let password = '123abc!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if(err) {
                   return done(err);   
                }
                
                User.findOne({email}).then(user => {
                    expect(user).toBeTruthy();
                    // expect(user.password).toNotBe(password);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return validation errors if request invalid', done => {
        let email = 'example';
        let password = '123abc!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', done => {
        let email = users[0].email;
        let password = '123abc!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) done(e);
                User.findById(users[1]._id).then(user => {
                    expect(user.tokens[0].token).toBe(res.headers['x-auth']);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should reject invalid login', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'abc123'
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err) done(e);
                User.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on log out', done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) done(err);
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});