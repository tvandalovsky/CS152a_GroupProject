'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var matchSchema = Schema( {
  employee:ObjectId,
  employeer: ObjectID,

  //matches:[]
} );

module.exports = mongoose.model( 'Match', matchSchema );
