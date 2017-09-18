const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = 'hiep1234';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

let hashedPassword = '$2a$10$StgzNZ7UWcn9RV0nIlAAbeRhsKX32VLTWhphCj8JFkFYvxKiAvYnW';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});

// const data = {
//     id: 10
// };

// let token = jwt.sign(data, '123abc');
// console.log(token);

// let decoded = jwt.verify(token, '123abc');
// console.log(decoded)

// let message = 'I am user 1';
// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// const data = {
//     id: 4
// };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some secret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// const resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString()

// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust');
// }
