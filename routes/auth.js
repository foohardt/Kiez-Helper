const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const Service = require('../models/Service');
const Ratin = require('../models/Rating');
const authRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');
const multer  = require('multer');


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// Route to upload path
const upload = multer({ dest: './public/uploads/' });

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

authRoutes.post("/signup", upload.single('photo'), (req, res, next) => {

  const username    = req.body.username;
  const password    = req.body.password;
  const email       = req.body.email;
  // const pictureUrl  = `/uploads/${req.body.photo}`;
  const pictureUrl  = "/uploads/" + req.body.photo;
  console.log("pictureUrl", pictureUrl)
  const picture     = "req.body.file.originalname";
  
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
      pictureUrl
    });
    
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/auth/private-page");
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
  Service.find()
  .then((services) => {
    // console.log(services)
    res.render("auth/private-page", { services });
  })
  .catch((error) => {
    console.log(error)
  })  
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

authRoutes.get("/auth/detail/:serviceId", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let serviceId = req.params.serviceId;
  let user = req.user;
  Service.findById(serviceId)
    .then(serviceDetail => {
      User.findById(serviceDetail._user_id)
      .then(provideUser => {
        res.render("auth/service-detail", { serviceDetail, provideUser, user });
      })
      .catch((error) => {
        console.log(error)
      })  
    })
    .catch((error) => {
      console.log(error)
    })  
});

authRoutes.get("/auth/requested", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/requested");
});

authRoutes.get("/auth/rate", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/rate");
});

authRoutes.get("/auth/rated", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/rated", { user: req.user });
});


module.exports = authRoutes;
