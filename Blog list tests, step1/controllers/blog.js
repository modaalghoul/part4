const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async(request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    } catch (e) {
        next(e)
    }
})


blogRouter.post('/', async(request, response, next) => {
    const blog = new Blog(request.body)

    try {
        const newBlog = await blog.save()
        response.status(201).json(newBlog)
    } catch (e) {
        next(e)
    }
})

blogRouter.get('/:id', async(request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    } catch (e) {
        next(e)
    }
})

blogRouter.delete('/:id', async(request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (e) {
        next(e)
    }
})

module.exports = blogRouter