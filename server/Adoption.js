//Imports mongoose so that we can make a database schema
const mongoose = require("mongoose");

//Schema that stores all the adoption form fields
const adoptionSchema = new mongoose.Schema({
    //Basic application information
  name: String,
  pet: String,
  reason: String,
  email: String,
  phone: String,
  address: String,

  //Background questions from the adoption form
  ownRent: String,
  otherPets: String,
  ownedBefore: String,
  petLocation: String,
  why: String,
  agree: Boolean,

  //User information shows if the user is logged in
  userId: String,
  userName: String,
  userEmail: String,

  //Changes the date automatically if the form is submitted
  date: { type: Date, default: Date.now }
});

//Export the model so that the server can save the adoption forms 
module.exports = mongoose.model("Adoption", adoptionSchema);