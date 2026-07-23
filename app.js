const express = require('express')
const mongoose = require('mongoose')
//Separate files for running app functions
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

//Use logger for console logs
logger.info('connecting to', config.MONGODB_URI)

//Create connection via Mongoose
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

//NOT DEFINED
//app.use(express.static('dist'))

//Use middlewares
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
//Export to index.js
module.exports = app
