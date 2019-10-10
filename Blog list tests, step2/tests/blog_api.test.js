const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)


test('verifies that _id property of the blog posts is named id', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})


afterAll(() => {
    mongoose.connection.close()
})