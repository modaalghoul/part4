const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const usersHelper = require('../utils/users_helper')
const User = require('../models/user')

const api = supertest(app)




describe('when there is initially one user at db', () => {
    beforeEach(async() => {
        await User.deleteMany({})
        const user = new User({ username: 'root', name: 'Superuser', passwordHash: 'secret' })
        await user.save()
    })

    test('creation succeeds with a fresh username', async() => {
        const usersAtStart = await usersHelper.usersInDb()

        const newUser = {
            username: 'hassan123',
            name: 'hassan alghoul',
            password: 'ghoul',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersHelper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async() => {
        const usersAtStart = await usersHelper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'mohammad',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)


        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await usersHelper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username less than 3 char', async() => {
        const usersAtStart = await usersHelper.usersInDb()

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'mohammad',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)


        expect(result.body.error).toContain('at least 3 characters')

        const usersAtEnd = await usersHelper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password less than 3 char', async() => {
        const usersAtStart = await usersHelper.usersInDb()

        const newUser = {
            username: 'angel',
            name: 'Superuser',
            password: 'mo',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)


        expect(result.body.error).toContain('at least 3 characters')

        const usersAtEnd = await usersHelper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

})

afterAll(() => {
    mongoose.connection.close()
})