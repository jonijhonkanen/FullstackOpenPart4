const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
//const listHelper = require('../utils/list_helper')

const mongoose = require('mongoose')
const supertest = require('supertest')
//Express app
const app = require('../app')
const Blog = require('../models/blog')

//Put test functions here?
const helper = require('../utils/list_helper')

const api = supertest(app)

//Delete all and save initial set

/*
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})*/

describe('when database has a default set saved', () => {
  //Initial data insertion
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  //JSON test
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  //Get all blogs
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    //assert.strictEqual(response.body.length, 2)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  //Find specific blog entry
  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map((e) => e.title)
    assert.strictEqual(titles.includes('How to HTML'), true)
  })

  //Test the identification field is id
  test('blog id', async () => {
    const response = await api.get('/api/blogs')

    //This works
    const hasIdField = (blog) => Object.keys(blog).includes('id')
    const isNamedId = await response.body.every(hasIdField)

    assert.strictEqual(isNamedId, true)
  })

  describe('when posting a blog list entry', () => {
    //Test for POST and check if added and correct form
    test('post blog', async () => {
      //Post new blog to database
      const newBlog = {
        title: 'ECMA Basics',
        author: 'John Basso',
        url: 'https://blogcloud/ecma_basics',
        likes: 256,
      }

      //POST request
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      //Check if added
      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map((res) => res.title)

      const latestBlog = blogsAtEnd[helper.initialBlogs.length]
      //Do this for object deepStrictequal comparison
      delete latestBlog.id

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      assert.deepStrictEqual(newBlog, latestBlog) //Check if these blogs are same
      assert(titles.includes('ECMA Basics'))
    })

    //POST without likes
    test('no likes', async () => {
      //Remove likes field
      const newBlog = {
        title: 'ECMA Basics',
        author: 'John Basso',
        url: 'https://blogcloud/ecma_basics',
        likes: null,
      }

      //Post new blog list item without likes
      await api.post('/api/blogs').send(newBlog).expect(201)
      //Check if likes value can be found
      const blogsAtEnd = await helper.blogsInDb()
      const hasLikesValue = blogsAtEnd.every((blog) => blog.likes >= 0)

      //Check if numeric value is 0 or more
      assert.strictEqual(hasLikesValue, true)
      //Check if added to list
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    //POST without title or URL and response 400
    test('missing fields', async () => {
      //Post new blog to database
      const newBlog = {
        title: 'ECMA Basics',
        author: 'John Basso',
        //url: 'https://blogcloud/ecma_basics',
        likes: 256,
      }

      //POST request
      await api.post('/api/blogs').send(newBlog).expect(400)
    })
  })

  describe('when a blog list entry is deleted', () => {
    test('delete blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map((blog) => blog.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('when blog list entry is modified', () => {
    test('modify blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToModify = blogsAtStart[0]

      //Change the like amount by 50
      const likesIncrease = 50
      blogToModify.likes += likesIncrease

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(blogToModify)
        .expect(201)

      //Get modified entry for comparison tests
      const modifiedBlog = await api.get(`/api/blogs/${blogToModify.id}`)

      //console.log(modifiedBlog.body)
      //console.log(modifiedBlog.body.likes)
      //Assert that likes has increased
      assert.strictEqual(modifiedBlog.body.likes == blogToModify.likes, true)
      //Assert all data is equal
      assert.deepStrictEqual(modifiedBlog.body, blogToModify)
    })
  })
})

//Close connection after tests
after(async () => {
  await mongoose.connection.close()
})

/*
//EXERCISES 4.3-4.7
//Dummy test, for first test
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

const largeBlogArray = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },

  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
  {
    _id: '5a422a851b54a676234d17g8',
    title: 'React tests',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
]

//Describe block for totalLikes tests
describe('total likes', () => {
  //First test with empty array and 0 likes
  const emptyBlogArray = []
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyBlogArray)
    assert.strictEqual(result, 0)
  })

  //Second test with one blog and its likes total
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  //Third test with a large array of blogs
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(largeBlogArray)
    assert.strictEqual(result, 43)
  })
})

//New describe block for other tests
describe('most likes', () => {
  test('most likes', () => {
    const result = listHelper.favoriteBlog(largeBlogArray)
    assert.deepStrictEqual(result, largeBlogArray[2])
  })
})

//
describe('most blogs', () => {
  test('author who has written most blogs', () => {
    const result = listHelper.mostBlogs(largeBlogArray)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('author who has most likes in total', () => {
    const result = listHelper.mostLikes(largeBlogArray)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
*/
