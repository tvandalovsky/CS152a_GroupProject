const express = require('express');
const router = express.Router();
const Employer= require('../models/Employer')



router.get('/',
  //isLoggedIn,
  async (req, res, next) => {
    try{
      res.locals.allEmployers= await Employers.find({})
      res.render('employers');
    }catch(err){
      console.log('Error in  employer')
            console.dir(err)
            next(err)
    }

});


router.post('/',
  async (req, res, next) => {
      const employer = new Employers(
        {
<<<<<<< HEAD
        name: req.body.name,
         companyName: req.body.cpmpanyName,
         companyWebsite: req.body.cpmpanyWebsite,
          picture: req.body.picture,
          positionLookingFor: req.body.positionLookingFor,
          salaryEstimate: req.body.salaryEstimate,
          userId : req.user._id
=======
        name:req.body.name,
         companyName:req.body.cpmpanyName,
         companyWebsite:req.body.cpmpanyWebsite,
          picture:req.body.picture,
          positionLookingFor:req.body.positionLookingFor,
          salaryEstimate:req.body.salaryEstimate,
          userId :req.user._id,
          EmployeeMatches: req.body.matches
>>>>>>> 49d9eafa30fca73f162c6cea288847192e7bc6ed
        })
        const employer = new Employer(employers)
        await employer.save();
        //res.render("todoVerification")
        res.redirect('/employers')
});


module.exports = router;
