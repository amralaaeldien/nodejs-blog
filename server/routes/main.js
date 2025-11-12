const express = require('express');
const router = express.Router();
const Post = require('../models/Post')


router.get('', async (req, res) => {

    let perPage= 1;
    let page = req.query.page || 0
    let count = await Post.find().countDocuments().exec()
    let nextPage = parseInt(page)+1
    const hasNextPage = count > (page*perPage+1)
    console.log(perPage, page, count, nextPage, hasNextPage)

    try {
        const posts = await Post.find().sort({createdAt : -1}).skip(perPage*page).limit(perPage)
        return res.render('index', {posts, current: page, nextPage: hasNextPage? nextPage: null})
    } catch(error) {
        console.log(error)
    }
})

router.get('/posts/:id', async (req, res) => {
    let slug = req.params.id
    try {
        let post = await Post.findById(slug).exec()
        res.render('post', {post: post})
    } catch(e) {
        console.log(e)
    }
})

router.post('/search', async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let result = await Post.find({$or: [{title: searchTerm}, {body: searchTerm}]}).exec()
         res.render('search', {result})
    } catch (e) {
        console.log(e)
    }
})

module.exports = router