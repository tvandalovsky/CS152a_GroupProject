'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
//var userSchema = mongoose.Schema( {any:{}})

var employerNewSchema = Schema( {
  employerName:String,
  companyName: String,
  companyWebsiteLink: String,
  employerEmail: String,
  logo:String,
  positionLookingFor:String,
  salaryEstimate:Number,
  //userId: ObjectId,
  EmployeeMatches:
    [
      {
        type: ObjectId,
        ref: "EmployeeNew"
      }
    ]
} );

module.exports = mongoose.model( 'EmployerNew', employerNewSchema );
