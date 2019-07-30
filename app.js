var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var mongoose = require('mongoose')
var swaggerUi = require('swagger-ui-express')

var config = require('./config')
var swaggerSpec = require('./libs/swagger')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var productsRouter = require('./routes/products')
var shoppingCartRouter = require('./routes/shoppingCarts')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/shoppingCarts', shoppingCartRouter)

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // render error json response
  return res.status(err.status || 500).json({ error: err.message })
})

module.exports = app

mongoose.connect(config.Database.Uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
