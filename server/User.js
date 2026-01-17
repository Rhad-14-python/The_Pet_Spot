//This imports mongoose so we can create a database schema
const mongoose = require("mongoose");

//Schema that stores all the user acount information
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  //User's full name area
  name: { 
    type: String, 
    required: true 
  },

  //User's email and must be unique
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  //Password for normal email/password login
  //Not required when using the Google Login
  password: { 
    type: String 
  }
});

//Exports all the model so the server can make and find users
module.exports = mongoose.model("User", userSchema);