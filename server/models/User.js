const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const UserModel = mongoose.model('User', UserSchema)

const insert = async () => {
    await PostModel.insertMany([{title: "Hello",body: "hello"},{title: "Hi",body: "hi"},{title: "No",body: "no"}])

}


module.exports = UserModel