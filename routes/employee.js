const express = require('express');
const router = express.Router();
const Employee= require('../models/Employee')



router.get('/',
  //isLoggedIn,
  async (req, res, next) => {
    try{
      res.locals.allEmployees= await Employess.find({})
      res.render('employees');
    }catch(err){
      console.log('Error in  employee')
            console.dir(err)
            next(err)
    }

});


router.post('/',

  async (req, res, next) => {
      const employees = new Employee(
        { name:req.body.name,
          schoolGraduatedFrom:req.body.schoolGraduatedFrom,
         linkdinLink:req.body.linkdinLink,
          picture:req.body.picture,
          yearGraduated:req.body.yearGraduated,
          skills:req.body.skills,
        })
      await employees.save();
      //res.render("todoVerification")
      res.redirect('/employees')
});



module.exports=router;
