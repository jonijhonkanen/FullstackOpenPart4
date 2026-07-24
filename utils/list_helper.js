//Dummy function, takes an array of blogs and returns 1
const dummy = (blogs) => {
  return 1
}

//Takes an array of blogs and returns the value of most likes
const totalLikes = (blogs) => {
  //let likes = 0
  return blogs.reduce(
    (accumulator, currentValue) => accumulator + currentValue.likes,
    0,
  )
}

//Takes an array and returns a blog object with most likes
const favoriteBlog = (blogs) => {
  //User the first entry as default
  let blogWithMostLikes = blogs[0]
  let currentMostLikes = blogs[0].likes
  //Check each blog from array
  blogs.forEach((blog) => {
    if (blog.likes >= currentMostLikes) {
      //Take the likes value from the blog
      currentMostLikes = blog.likes
      //Take this blog as current most liked
      blogWithMostLikes = blog
    }
  })

  //Return the actual blog
  return blogWithMostLikes
}

//Returns author with most blogs and total number of their blogs
//IMPLEMENT WITHOUT LODASH for now
const mostBlogs = (blogs) => {
  let numberOfBlogs = 0
  let currentAuthor = ''
  let checkedAuthors = []
  //
  blogs.forEach((blog) => {
    currentAuthor = blog.author
    if (!checkedAuthors.some((e) => e.author === currentAuthor)) {
      //Iterate the number of blogs for author
      blogs.forEach((blog) => {
        //Increase number of blogs for current author
        if (blog.author === currentAuthor) {
          numberOfBlogs++
        }
      })
      let authorToList = { author: currentAuthor, blogs: numberOfBlogs }
      //Insert into array
      checkedAuthors.push(authorToList)
      //reset number of blogs for the next author
      numberOfBlogs = 0
    }
  })

  //console.log('Length of the checked author list: ' + checkedAuthors.length)
  //Reduce the best author
  authorWithMostBlogs = checkedAuthors.reduce((prev, current) => {
    return prev.blogs > current.blogs ? prev : current
  })
  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  let numberOfLikes = 0
  let currentAuthor = ''
  let checkedAuthors = []
  //For each blog list item
  blogs.forEach((blog) => {
    currentAuthor = blog.author
    if (!checkedAuthors.some((e) => e.author === currentAuthor)) {
      //For each author's blog
      blogs.forEach((blog) => {
        //Increase number of blogs for current author
        if (blog.author === currentAuthor) {
          numberOfLikes += blog.likes
        }
      })

      let authorToList = { author: currentAuthor, likes: numberOfLikes }
      //Insert into array
      checkedAuthors.push(authorToList)
      //reset number of likes for the next author
      numberOfLikes = 0
    }
  })

  //Reduce
  return checkedAuthors.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
