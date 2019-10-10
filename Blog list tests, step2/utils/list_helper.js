const dummy = blogs => {
    return 1;
}

const totalLikes = blogs => {
    return blogs.length !== 0 ?
        blogs.reduce((sum, item) => sum + item.likes, 0) :
        0
}

const mostFavoriteBlog = blogs => {
    if (blogs.length !== 0) {
        const likes = blogs.map(blog => blog.likes)
        const mostFavBlog = blogs.find(blog => blog.likes === Math.max(...likes))
        const picked = (({ title, author, likes }) => ({ title, author, likes }))(mostFavBlog);

        return (picked)
    }
    return {}
}




module.exports = { dummy, totalLikes, mostFavoriteBlog }