// app.js
var express = require('express');
var app = express();
var db = require('./db'); //ADD THIS LINE
module.exports = app;

var UserController = require('./user/UserController')
app.use('/users', UserController);
module.exports = app;