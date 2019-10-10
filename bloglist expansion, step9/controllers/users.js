const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


usersRouter.get('/', async(request, response, next) => {
    try {
        const users = await User.find({}).populate('blogs', { title: 1, url: 1, author: 1 })
        response.json(users.map(user => user.toJSON()))
    } catch (e) {
        next(e)
    }
})


usersRouter.post('/', async(request, response, next) => {
    const body = request.body

    if (body.password.length < 3 || body.username.length < 3)
        return response.status(400).json({ error: 'username and password should be at least 3 characters' })

    if (!body.username || !body.name || !body.password)
        return response.status(400).json({ error: 'missing data' })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)



    try {
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash: passwordHash
        })

        const newUser = await user.save()
        response.status(200).json(newUser.toJSON())
    } catch (e) {
        next(e)
    }
})

usersRouter.get('/:id', async(request, response, next) => {
    try {
        const user = await User.findById(request.params.id)
        if (user) {
            response.json(user.toJSON())
        } else {
            response.status(404).end()
        }
    } catch (e) {
        next(e)
    }
})

usersRouter.delete('/:id', async(request, response, next) => {
    try {
        await User.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (e) {
        next(e)
    }
})


module.exports = usersRouter