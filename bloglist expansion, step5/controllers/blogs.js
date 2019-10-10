const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async(request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs.map(blog => blog.toJSON()))
    } catch (e) {
        next(e)
    }
})


blogsRouter.post('/', async(request, response, next) => {
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
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
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