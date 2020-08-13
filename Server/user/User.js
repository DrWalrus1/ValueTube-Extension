// User.js
var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String
});
//mongoose.model('User', UserSchema);
module.exports = mongoose.model('User', UserSchema, "users2");

/* TODO: 
  1. Add more properties to user database entries
  2. Figure out how to store passwords securely
  3. Implement Passport.js login using Google 
*/