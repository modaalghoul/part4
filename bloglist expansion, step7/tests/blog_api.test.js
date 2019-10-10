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

test('a blog with missing title or url responds with 400 ', async() => {
    const missingDataBlog = {
        author: 'Mohammad AlGhoul',
    }

    const response = await api
        .post('/api/blogs')
        .send(missingDataBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'missing data' })

    const blogsAtEnd = await blogsHelper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsHelper.initialBlogs.length)

})


test('delete a blog succeeds with status code 204 if id is valid', async() => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await blogsHelper.blogsInDb()

    expect(blogsAtEnd.length).toBe(
        blogsHelper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
})

test('update a blog likes succeeds', async() => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const blogToUpdate = {
        title: blogsAtStart[0].title,
        author: blogsAtStart[0].author,
        url: blogsAtStart[0].url,
        likes: 100
    }

    const response = await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(blogToUpdate)
        .expect(200)

    expect(response.body.likes).toBe(100)
    expect(response.body.likes).not.toBe(blogsAtStart[0].likes)
})


afterAll(() => {
    mongoose.connection.close()
})