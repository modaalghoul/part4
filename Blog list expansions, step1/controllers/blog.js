const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async(request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs.map(blog => blog.toJSON()))
    } catch (e) {
        next(e)
    }
})


blogRouter.post('/', async(request, response, next) => {
    const body = request.body

    if (!body.title || !body.url)
        return response.status(400).json({ error: 'missing data' })

    const blog = new Blog(request.body)

    try {
        const newBlog = await blog.save()
        response.status(201).json(newBlog.toJSON())
    } catch (e) {
        next(e)
    }
})

blogRouter.get('/:id', async(request, response, next) => {
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

blogRouter.delete('/:id', async(request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (e) {
        next(e)
    }
})

module.exports = blogRouter