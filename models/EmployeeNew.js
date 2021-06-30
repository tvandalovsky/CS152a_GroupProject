'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
//var userSchema = mongoose.Schema( {any:{}})

var employeeNewSchema = Schema( {
  employeeName: String,
  schoolGraduatedFrom: String,
  employeeEmail:String, 
  linkdinLink: String,
  picture: String,
  desiredPosition: String,
  yearGraduated: Number,
  skills: String,
  //userId: ObjectId,
//  resume: GridFS,
  EmployerMatches:
    [
        {
            type:ObjectId,
            ref:"EmployerNew"
        }
    ]
});

module.exports = mongoose.model( 'EmployeeNew', employeeNewSchema);
