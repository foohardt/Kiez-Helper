const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const Service = require('../models/Service');
const Ratin = require('../models/Rating');
const authRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');



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
<<<<<<< HEAD
  res.render("auth/private-page", { user: req.user });
=======
  
  Service.find()
  .then((services) => {
    console.log(services)
    res.render("auth/private-page", { services });
  })
  .catch((error) => {
    console.log(error)
  })  
>>>>>>> eafedc7b46737987245bc8135a76f1e8497292c3
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
  console.log(req.user)

  let newService = new Service({
    title:        req.body.title,
    category:     req.body.category,
    description:  req.body.description,
    location:     req.body.location,
    time:         req.body.date,
    _user_id:     req.user.id,
  })

  newService.save((error) => {
    if (error) { next(error) }
    else {
      console.log("DEBUG saved new service")
      res.redirect('/auth/private-page')
    }
  })
});

// Service detail page

authRoutes.get("/auth/detail", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/service-detail");
});

module.exports = authRoutes;
