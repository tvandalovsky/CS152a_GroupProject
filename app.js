var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require( 'mongoose' );
const layouts = require("express-ejs-layouts");

mongoose.connect( 'mongodb://localhost/authDemo');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const User = require('./models/User');
const Employee = require('./models/Employee');
const Employer = require('./models/Employer');

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var employeeRouter = require('./routes/employee');
var employerRouter = require('./routes/employer');

var app = express();

//<a href=“/match/<%= employee._id %>”> employee.name </a>


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(authRouter)

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get("/about", (request, response) => {
  response.render("about");
});


app.post("/tester", (request,response) => {
  response.render("login")
});

app.get('/login', (request,response) => {
  response.render("views/matches.ejs")
});

app.post('/employeeEmployeer',
async (req,res,next) => {
  try {
    let isEmployee = req.body.isEmployee
    if(isEmployee === 'true'){
      req.user.isEmployee = isEmployee
      await req.user.save()
      console.log(req.user.isEmployee);
      res.render('employees')
    }
    else if(isEmployee === 'false') {
      req.user.isEmployee = isEmployee
      await req.user.save()
      console.log(req.user.isEmployee);
      res.render('employer')
    }
  } catch (error) {
    next(error)
  }
});

app.post('/matchWith',
async (req,res,next) => {
  try {
    if(matchWith === 'yes'){
      req.body.employeeID=employeeNum;
      req.body.employerID=employerNum
      await req.match.save()
      res.render('matches')
    }

  } catch (error) {
    next(error)
  }
});
//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
