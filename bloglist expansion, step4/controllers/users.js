const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


usersRouter.get('/', async(request, response, next) => {
    try {
        const users = await User.find({})
        response.json(users.map(user => user.toJSON()))
    } catch (e) {
        next(e)
    }
})


usersRouter.post('/', async(request, response, next) => {
    const body = request.body

    if (!body.username || !body.name || !body.password)
        return response.status(400).json({ error: 'missing data' })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    try {
        const newUser = await user.save()
        response.status(201).json(newUser.toJSON())
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