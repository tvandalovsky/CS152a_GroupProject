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

app.get("/aboutEmployee", (request, response) => {
  response.render("/aboutEmployee");
});

app.get("/test", (request, response) => {
  response.render("test");
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
  res.render("employer")
});


const EmployeeNew = require('./models/EmployeeNew');
const EmployerNew = require('./models/EmployerNew');

app.post('/employeeEmployeer',
  isLoggedIn,
  async (req,res,next) => {
  try {
     const isEmployee = req.body.isEmployee
     res.locals.isEmployee = isEmployee;
    if(isEmployee === 'true'){
      console.log('The current user is employee');
      // res.locals.employees = await EmployeeNew.find({})
      // console.log('employees length='+JSON.stringify(res.locals.employees.length));
      res.render('employeeNew')
    }
    else if(isEmployee === 'false') {
      console.log('The current user is employer');
      // res.locals.employers = await User.find({isEmployee:false});
      // console.log('employers length='+JSON.stringify(res.locals.employers.length));
      res.render('employerNew')
    }
  } catch (error) {
    next(error)
  }
});

app.post("/employeeNew",
  isLoggedIn,
  async (req,res,next) => {

    const employeeName = req.body.employeeName
    const schoolGraduatedFrom = req.body.schoolGrauatedFrom
    const linkdinLink = req.body.linkdinLink
    const picture = req.body.picture
    const desiredPosition = req.body.desiredPosition
    const yearGraduated = req.body.yearGraduated
    const skills = req.body.skills
    const EmployerMatches = [];

    res.locals.employersNew = await EmployerNew.find({});
    const employersNewTemp = await EmployerNew.find({});
    console.log('employersNew='+JSON.stringify(res.locals.employersNew.length))
    console.log('typeof length ' + typeof(parseInt((JSON.stringify(res.locals.employersNew.length)))));
    const employersNewLength = parseInt(JSON.stringify(res.locals.employersNew.length));


    const employeeInfo = new EmployeeNew({
      employeeName:employeeName,
      schoolGraduatedFrom:schoolGraduatedFrom,
      linkdinLink:linkdinLink,
      picture:picture,
      desiredPosition:desiredPosition,
      linkdinLink:linkdinLink,
      yearGraduated:yearGraduated,
      skills:skills,
      EmployerMatches:[],
    })

    const currPostion = employeeInfo.desiredPosition

    if (employersNewLength !=0) {
        console.log('INside pushing')

          employersNewTemp.forEach(employerNew => {
               if(employerNew.positionLookingFor == currPostion) {
                      employeeInfo.EmployerMatches.push(employerNew._id);
                      console.log("Matches Emplyer's id");
                      console.log(employerNew._id);
                      console.log('Typd of EmplyerNew.id')
                      console.log(typeof(employerNew._id))
                }
          })


    }



    const result = await employeeInfo.save();
    await EmployerNew.updateMany({positionLookingFor:currPostion},{$addToSet:{EmployeeMatches: employeeInfo._id}});
    console.log('result=')
    console.dir(result)
    res.redirect('/employeesNew')
})


app.get('/employeesNew', isLoggedIn,
  async (req,res,next) => {
    res.locals.employeesNew = await EmployeeNew.find({})
    console.log('employees='+JSON.stringify(res.locals.employeesNew.length))
    res.render('employeesNew')
  })



app.get('/employeeNewremove/:employeeNew_id', isLoggedIn,
async (req,res,next) => {

  const employeeNew_id = req.params.employeeNew_id
  console.log(`id=${employeeNew_id}`)
  await EmployeeNew.deleteOne({_id:employeeNew_id })
  await EmployerNew.updateMany({},{$pull:{EmployeeMatches: employeeNew_id}});


  res.redirect('/employeesNew')

})


// Here comes the Employer Section
app.post("/employerNew",
  isLoggedIn,
  async (req,res,next) => {

    const employerName = req.body.employerName
    const companyName = req.body.companyName
    const companyWebsiteLink= req.body.companyWebsiteLink
    const logo= req.body.logo
    const positionLookingFor = req.body.positionLookingFor
    const salaryEstimate = req.body.salaryEstimate
    const EmployeeMatches = [];

    res.locals.employeesNew = await EmployeeNew.find({});
    const employeesNewTemp = await EmployeeNew.find({});
    console.log('employeesNew='+JSON.stringify(res.locals.employeesNew.length))
    console.log('typeof length ' + typeof(parseInt((JSON.stringify(res.locals.employeesNew.length)))));
    const employeesNewLength = parseInt(JSON.stringify(res.locals.employeesNew.length));



    const employerInfo = new EmployerNew({
      employerName:employerName,
      companyName:companyName,
      companyWebsiteLink:companyWebsiteLink,
      logo:logo,
      positionLookingFor:positionLookingFor,
      salaryEstimate:salaryEstimate,
      EmployeeMatches:[],

    })



    const currPostion = employerInfo.positionLookingFor


    if (employeesNewLength !=0) {
        console.log('INside pushing')

          employeesNewTemp.forEach(employeeNew => {
               if(employeeNew.desiredPosition == currPostion) {
                      employerInfo.EmployeeMatches.push(employeeNew._id);
                      console.log("Matches Emplyee's id");
                      console.log(employeeNew._id);
                      console.log('Type of EmplyeeNew.id')
                      console.log(typeof(employeeNew._id))
                }
          })
    }


    const result = await employerInfo.save();
    await EmployeeNew.updateMany({desiredPosition:currPostion},{$addToSet:{EmployerMatches: employerInfo._id}});
    console.log('result=')
    console.dir(result)
    res.redirect('/employersNew')





})


app.get('/employersNew', isLoggedIn,
  async (req,res,next) => {
    res.locals.employersNew = await EmployerNew.find({})
    console.log('employers='+JSON.stringify(res.locals.employersNew.length))
    res.render('employersNew')
  })


app.get('/employerNewremove/:employerNew_id', isLoggedIn,
  async (req,res,next) => {

  const employerNew_id = req.params.employerNew_id
  console.log(`id=${employerNew_id}`)
  await EmployerNew.deleteOne({_id:employerNew_id })
  await EmployeeNew.updateMany({},{$pull:{EmployerMatches: employerNew_id}});
  res.redirect('/employersNew')


})






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
