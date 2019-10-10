const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogsHelper = require('../utils/test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async() => {
    await Blog.deleteMany({})

    let blogObject = new Blog(blogsHelper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(blogsHelper.initialBlogs[1])
    await blogObject.save()
})

test('verifies that _id property of the blog posts is named id', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added ', async() => {
    const newBlog = {
        title: 'JavaScript Promises',
        author: 'David Walsh',
        url: 'https://davidwalsh.name/promises',
        likes: 276
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(blogsHelper.initialBlogs.length + 1)
    expect(titles).toContain(
        'JavaScript Promises'
    )
})


test('a blog with no likes added as 0 likes ', async() => {
    const blogWithNoLikes = {
        title: '5 reasons to learn javascript in 2019',
        author: 'Prashant Yadav',
        url: 'https://learnersbucket.com/tech/5-reasons-to-learn-javascript-in-2019/',
    }

    await api
        .post('/api/blogs')
        .send(blogWithNoLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const likes = response.body.map(r => r.likes)

    expect(likes).toContain(0)
})


afterAll(() => {
    mongoose.connection.close()
})