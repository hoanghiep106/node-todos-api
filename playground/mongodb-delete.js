const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // Delete many
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then(result => {
    //     console.log(result);
    // }, err => {
    //     console.log('Unable to delete todos', err)
    // });

    // Delete one
    // db.collection('Todos').deleteOne({text: 'Bring lunch'}).then(result => {
    //     console.log(result);
    // }, err => {
    //     console.log('Unable to delete todo', err)
    // })

    //Find one and delete
    // db.collection('Todos').findOneAndDelete({completed: false}).then(doc => {
    //     console.log(doc);
    // })

    // db.collection('Users').deleteMany({name: 'Hiep'}).then(result => {
    //     console.log(result);
    // })

    db.collection('Users').deleteOne({_id: new ObjectId('59b1e2977f6568b5b6e9c170')}).then(result => {
        console.log(result);
    })

    db.close();
});;