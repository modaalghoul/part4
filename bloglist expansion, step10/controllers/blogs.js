const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async(request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        response.json(blogs.map(blog => blog.toJSON()))
    } catch (e) {
        next(e)
    }
})


blogsRouter.post('/', async(request, response, next) => {
    const body = request.body

    const token = request.token

    if (!body.title || !body.url)
        return response.status(400).json({ error: 'missing data' })

    try {

        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const specificUser = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: specificUser._id
        })



        const newBlog = await blog.save()
        specificUser.blogs = specificUser.blogs.concat(newBlog._id)
        await specificUser.save()
        response.status(201).json(newBlog.toJSON())
    } catch (e) {
        next(e)
    }
})

blogsRouter.get('/:id', async(request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog.toJSON())
        } else {
            response.status(404).end()
        }
    } catch (e) {
        next(e)
    }
})

blogsRouter.delete('/:id', async(request, response, next) => {

    const token = request.token

    try {

        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const blogToDelete = await Blog.findById(request.params.id)
        if (blogToDelete.user.toString() === decodedToken.id.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } else {
            response.status(401).json({ error: 'unauthorized' })
        }

    } catch (e) {
        next(e)
    }
})

blogsRouter.put('/:id', async(request, response, next) => {
    const body = request.body


    if (!body.title || !body.url || !body.likes || !body.author)
        return response.status(400).json({ error: 'data missing' })

    const newBlog = {
        title: body.title,
        likes: body.likes,
        url: body.url,
        author: body.author
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
        if (updatedBlog) {
            response.status(200).json(updatedBlog.toJSON())
        } else {
            response.status(404).end()
        }

    } catch (e) {
        next(e)
    }

})

module.exports = blogsRouter