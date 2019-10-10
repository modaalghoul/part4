const Blog = require('../models/blog')

const initialBlogs = [{
        title: 'How to Build and Deploy a Full-Stack React-App',
        author: 'Frank Zickert',
        url: 'https://medium.com/dailyjs/how-to-build-and-deploy-a-full-stack-react-app-4adc46607604',
        likes: 200
    },
    {
        title: 'Understanding JavaScript Function Invocation and "this"',
        author: 'Yehuda Katz',
        url: 'https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/',
        likes: 324
    }
]

const nonExistingId = async() => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async() => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}



module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}