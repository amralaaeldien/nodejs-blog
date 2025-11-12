const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({message: 'unauthorized'})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch(e) {
        return res.status(401).json({message: 'unauthorized'})
    }
}

router.get('/admin', async (req, res) => {
    try{
        res.render('admin/index', {layout: adminLayout})
    } catch(e) {
        console.log(e)
    }
})

router.post('/admin', async (req, res) => {
    try{
        const {username, password} = req.body
        const user = await User.findOne({username})
        if(!user) {
            return res.status(401).json({message: 'invalid credentials'})
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            return res.status(401).json({message: 'invalid credentials'})
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET)
        res.cookie("token", token, {httpOnly: true})
        res.redirect('/dashboard')

    } catch(e) {
        console.log(e)
    }
})

router.get('/dashboard', authMiddleware, async(req, res) => {
    try{
        const data = await Post.find();
        res.render('admin/dashboard', {data, layout: adminLayout})
    
    } catch(e) {
        console.log(e)
    }
})

router.get('/add-post', authMiddleware, async(req, res) => {
    try{
        res.render('admin/add-post', { layout: adminLayout})
    
    } catch(e) {
        console.log(e)
    }
})

router.post('/add-post', authMiddleware, async(req, res) => {
    try{
        const post = new Post({
            title: req.body.title,
             body: req.body.body
        })
        await post.save()
        res.redirect('/dashboard')
    } catch(e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try{
        const {username, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({username, password: hashedPassword})

        res.status(201).json({message: 'User created', user})

    } catch(e) {
        if(error.code === 11000){
            res.status(409).json({message: 'user already in use'})
        }
        res.status(500).json({message: 'internal server error'})
    }
})

router.get('/edit-post/:id', authMiddleware, async(req, res) => {
    try{
        const data = await Post.findOne({_id: req.params.id})
        res.render(`admin/edit-post`, {data, layout: adminLayout})
    
    } catch(e) {
        console.log(e)
    }
})

router.post('/edit-post/:id', authMiddleware, async(req, res) => {
    try{
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        })
        res.redirect(`/edit-post/${req.params.id}`)
    } catch(e) {
        console.log(e)
    }
})

router.post('/delete-post/:id', authMiddleware, async (req, res) => {
    try{
        await Post.findOneAndDelete(req.params.id)
        res.redirect('/dashboard')
    } catch (e) {
        console.log(e)
    }
})


router.get('/logout', authMiddleware, async(req, res) => {
    res.clearCookie('token')
    res.json({message: 'logout successful'})
})
module.exports = router