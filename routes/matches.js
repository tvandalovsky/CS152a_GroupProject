const express = require('express');
const router = express.Router();
const Match= require('../models/Match')



router.get('/',
  //isLoggedIn,
  async (req, res, next) => {
    try{
      const employer =await Employer.find({userId:req.user._id})
      const employeeNum=req.body.employeeNum
      res.render('matches');
    }catch(err){
      console.log('Error in  match')
            console.dir(err)
            next(err)
    }

});


router.post('/',

  async (req, res, next) => {
      const matchesList = new Match(
        { employee:employeeNum,
          employeer:employerNum 
        })
      await matches.save();
      //res.render("todoVerification")
      res.redirect('/matches')
});



module.exports=router;
