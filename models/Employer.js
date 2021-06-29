'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var employerSchema = Schema( {
  name:String,
  companyName: String,
  comanyWebsiteLink: String,
  picture:String,
  positionLookingFor:String,
  salaryEstimate:Number,
  userId: ObjectID
  //matches:[]
} );

module.exports = mongoose.model( 'Employer', employerSchema );
