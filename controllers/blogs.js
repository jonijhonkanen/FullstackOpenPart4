//Blogrouter contains express router routes for data base traffic
const blogsRouter = require('express').Router()
//Blog contains Mongoose schema
const Blog = require('../models/blog')

//GET All blog list items at once
//Refactored to async await
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

//GET for one blog list item by id
//NOT REFACTORED YET
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

//POST for saving new blog list item
//Refactored to async await
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  //console.log(body.title)
  //console.log(body.url)

  //Check title or url fields
  const hasMissingFields = body.title == null || body.url == null
  //console.log(hasMissingFields)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  //Response based on missing fields
  if (!hasMissingFields) {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } else {
    response.status(400).json('title or URL missing')
  }
})

//DELETE for deleting a blog list item
//Refactored to async await
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

//PUT for updating blog list item
//Refactored to async await
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  //If blog cannot be found with given id
  if (!blog) {
    response.status(404).end()
  }

  //Put new values to fields
  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  //Save the modified blog entry and send response
  const modifiedBlog = await blog.save()
  response.status(201).json(modifiedBlog)
})

module.exports = blogsRouter
