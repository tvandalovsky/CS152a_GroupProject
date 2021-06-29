'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
//var userSchema = mongoose.Schema( {any:{}})

var employerSchema = Schema( {
  name:String,
  companyName: String,
  comanyWebsiteLink: String,
  picture:String,
  positionLookingFor:String,
  salaryEstimate:Number,
  userId: ObjectId,
  EmployeeMatches:[ObjectId]
} );

module.exports = mongoose.model( 'Employer', employerSchema );
