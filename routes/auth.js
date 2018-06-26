const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const authRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');
const router = express.Router();


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// Log in

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// Sign up

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const picture = req.body.image;

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

// Log out

authRoutes.get("/logout", (req, res) => {
  console.log(req.session.currentUser)
  if (!req.session.currentUser) {
    res.redirect("/");
    return
  }
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return
    }
    res.redirect("/");
  })
});

// Private home

authRoutes.get("/auth/private-page", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/private-page", { user: req.user });
});

// Profile page

authRoutes.get("/auth/profile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/profile", { user: req.user });
});

// New service

authRoutes.get("/auth/new", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/new-service");
});

authRoutes.post("/auth/new", ensureLogin.ensureLoggedIn(), (req, res, next) => {

  let newService = new Service({
    title: req.body.title,
  })



  const newPlace = new Place({
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    location: loc
  });
  newPlace.save((error) => {
    if (error) { next(error) }
    else {
      res.redirect('/');
    }
  })


})

// Service detail page

authRoutes.get("/auth/detail", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/service-detail");
});

module.exports = authRoutes;
