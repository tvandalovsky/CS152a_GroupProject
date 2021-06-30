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

//var employeeRouter = require('./routes/employee');
//var employerRouter = require('./routes/employer');

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

app.get("/aboutMajorEmployeers", (request, response) => {
  response.render("/aboutMajorEmployeers");
});

app.post("/tester", (request,response) => {
  response.render("login")
});

app.get('/login', (request,response) => {
  response.render("views/matches.ejs")
});

app.get('/employeeGet', (req,res) => {
  res.render("employees")
});

app.get('/employerGet', (req,res) => {
  res.render("employers")
});


app.post('/employeeEmployeer',
async (req,res,next) => {
  try {
    let isEmployee = req.body.isEmployee
    if(isEmployee === 'true'){
      req.user.isEmployee = isEmployee
      await req.user.save()
      console.log(req.user.isEmployee);
      res.locals.employees = await User.find({isEmployee:true});
      console.log('employees length='+JSON.stringify(res.locals.employees.length));
      res.render('employees')
    }
    else if(isEmployee === 'false') {
      req.user.isEmployee = isEmployee
      await req.user.save()
      console.log(req.user.isEmployee);
      res.locals.employers = await User.find({isEmployee:false});
      console.log('employers length='+JSON.stringify(res.locals.employers.length));
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
      const employer = await Employer.find({userId: req.user._id});
      const employeeID = req.body.EmployeeID
      employer.employeeMatches.push(employeeID)
      const eomployerId=employer._id
      const employee=await Employer.find({employeeID});
      employee.employer<atches.push(employerID)

    }

  } catch (error) {
    next(error)
  }
});


///////////////////
app.post('/employerRouter',
  async (req, res, next) => {
      const employer = new Employer(
        {
         name:req.body.name,
         companyName:req.body.companyName,
         companyWebsite:req.body.companyWebsiteLink,
          picture:req.body.picture,
          positionLookingFor:req.body.positionLookingFor,
          salaryEstimate:req.body.salaryEstimate,
          userId :req.user._id,
          EmployeeMatches: req.body.matches
        })
        //const employer = new Employer(employers)
        await employer.save();
        //res.render("todoVerification")
        res.render('matches')
});


/////////////////
app.post('/employeeRouter',

  async (req, res, next) => {
      const employees = new Employee(
        { name:req.body.name,
          schoolGraduatedFrom:req.body.schoolGraduatedFrom,
         linkdinLink:req.body.linkdinLink,
          picture:req.body.picture,
          yearGraduated:req.body.yearGraduated,
          skills:req.body.skills,
          userId :req.user._id,
          EmployerMatches: req.body.matches
        })
      await employees.save();
      //res.render("todoVerification")
      res.render('matches')
});

app.get('/employeeRouter',
  //isLoggedIn,
  async (req, res, next) => {
    try{
      res.locals.allEmployees= await Employee.find({})
      res.render('employees');
    }catch(err){
      console.log('Error in  employee')
            console.dir(err)
            next(err)
    }

});

app.get('/employerRouter',
  //isLoggedIn,
  async (req, res, next) => {
    try{
      res.locals.allEmployees= await Employer.find({})
      res.render('employees');
    }catch(err){
      console.log('Error in  employee')
            console.dir(err)
            next(err)
    }

});

app.get('/employerRouter',
  //isLoggedIn,
  async (req, res, next) => {
    try{
      res.locals.allEmployers= await Employer.find({})
      res.render('employers');
    }catch(err){
      console.log('Error in  employer')
            console.dir(err)
            next(err)
    }

});


// router.post('/',
//   async (req, res, next) => {
//       const employees = new Employee(
//         { name:req.body.name,
//           schoolGraduatedFrom:req.body.schoolGraduatedFrom,
//          linkdinLink:req.body.linkdinLink,
//           picture:req.body.picture,
//           yearGraduated:req.body.yearGraduated,
//           skills:req.body.skills,
//           userId :req.user._id,
//           EmployerMatches: req.body.matches
//         })
//       await employees.save();
//       //res.render("todoVerification")
//       res.redirect('/employees')
// });


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
