const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectId('59b1e40e7f6568b5b6e9c1b8')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then(result => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        name: 'Hoang Anh'
    }, {
        $set: {
            name: 'Hiep'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then(result => {
        console.log(result);
    })

    db.close();
});;