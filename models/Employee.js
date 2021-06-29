'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
//var userSchema = mongoose.Schema( {any:{}})

var employeeSchema = Schema( {
  name: String,
  schoolGraduatedFrom: String,
  linkdinLink: String,
  picture: String,
  desiredPosition: String,
  yearGraduated: Number,
  skills: String,
  userId: ObjectId,
//  resume: GridFS,
  EmployerMatches:[ObjectId]
} );

module.exports = mongoose.model( 'Employee', employeeSchema );
