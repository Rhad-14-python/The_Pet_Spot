//Importing mongoose so that we can make a database schema for this
const mongoose = require("mongoose");

//Schema that stores all the orders informationn from the shop 
const orderSchema = new mongoose.Schema({
  items: Array,

  //All the Total prices of the orders
  total: Number,

  //User informations if they are logged in 
  userId: String,
  userName: String,
  userEmail: String,

  //Automaticalyy stores the data if the user ordered 
  date: { type: Date, default: Date.now }
});

//Export the model so that the server save the orders
module.exports = mongoose.model("Order", orderSchema);