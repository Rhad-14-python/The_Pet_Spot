
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
require('./passport-config');

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => {
    res.redirect('/');
  }
);


app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


app.use('/', express.static(path.join(__dirname, 'public/landing')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});