const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
})

const PostModel = mongoose.model('Post', PostSchema)

const insert = async () => {
    await PostModel.insertMany([{title: "Hello",body: "hello"},{title: "Hi",body: "hi"},{title: "No",body: "no"}])

}


module.exports = PostModel