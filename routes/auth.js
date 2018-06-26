const express     = require('express');
const passport    = require('passport');
const User        = require('../models/User');
const authRoutes  = express.Router();

 
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// Log in

authRoutes.get("/auth/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post('/auth/login', (req, res, next) => {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne({ email: emailInput }, (err, theUser) => {
    if (err || theUser === null) {
      res.render('auth/login', {
        errorMessage: `There isn't an account with email ${emailInput}.`
      });
      return;
    }

    if (!bcrypt.compareSync(passwordInput, theUser.password)) {
      res.render('auth/login', {
        errorMessage: 'Invalid password.'
      });
      return;
    }

    req.session.currentUser = theUser;
    console.log("DEBUG: authentification complete")
    res.redirect('/auth/private-page');
  });
});

// Sign up

authRoutes.get("/auth/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/auth/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;
  const picture  = req.body.image;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      picture,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/auth/profile", (req, res, next) => {
  res.render("auth/profile");
});

authRoutes.get("/auth/private-page", (req, res, next) => {
  res.render("auth/private-page");
});

authRoutes.get("/auth/detail", (req, res, next) => {
  res.render("auth/service-detail");
});

authRoutes.get("/auth/new", (req, res, next) => {
  res.render("auth/new-service");
});

module.exports = authRoutes;
