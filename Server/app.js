// app.js
var express = require('express');
var app = express();
var db = require('./db');
module.exports = app;

var UserController = require('./user/UserController')
app.use('/users', UserController); // <--- This is the url ending that is called by the extension
module.exports = app;