const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const Service = require('../models/Service');
const Rating = require('../models/Rating');
const authRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');
const nodemailer = require("nodemailer");
const uploadCloud = require('../config/cloudinary');

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

authRoutes.post("/signup", uploadCloud.single('photo'), (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const picture = req.file.url;

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
      picture
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

// Private page

authRoutes.get("/auth/private-page", ensureLogin.ensureLoggedIn(), (req, res, next) => {

  Service.find({ acceptedToken: false })
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
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    location: req.body.location,
    time: req.body.date,
    requestOwner: req.user.id,
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
      User.findById(serviceDetail.requestOwner)
        .then(createdUser => {
          res.render("auth/service-detail", { serviceDetail, createdUser, user });
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch((error) => {
      console.log(error)
    })
});

// Accept Request

authRoutes.get("/auth/requested/:serviceId", ensureLogin.ensureLoggedIn(), (req, res, next) => {

  let serviceId = req.params.serviceId;

  Service.findById(serviceId)
    .then(serviceDetail => {
      let requestOwnerId = serviceDetail.requestOwner;
      User.findById(requestOwnerId)
        .then(ownerDetail => {
          // Nodemailer  
          // Message transporter service provider 
          let subjectProvider = "Find my help: Your request answer has been sent";
          let messageProvider = "Thank you for answering " + serviceDetail.title + " by " + ownerDetail.username + ". Please contact " + ownerDetail.email + " to get in touch with " + ownerDetail.username + ".";
          let transporterProvider = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.GMAIL_EMAIL,
              pass: process.env.GMAIL_PASSWORD
            }
          });
          transporterProvider.sendMail({
            from: '"Find-My-Help" <${process.env.GMAIL_EMAIL}>',
            to: req.user.email,
            subject: subjectProvider,
            text: messageProvider,
            html: `<b>${messageProvider}</b>`
          })

          // Message transporter service owner 
          let subjectOwner = "Find my help: Your request with the title " + serviceDetail.title + " has been answered";
          let messageOwner = "Your request has been answered by " + req.user.username + ", who will contact you shortly. The last rating of " + req.user.username + " was " + req.user.lastRating + ". As soon as the service is fullfilled you may want to share your experience with other users and rate the quality of the fullfillment in the following link: http:/localhost:3000/auth/rate/" + req.params.serviceId;
          let transporterOwner = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.GMAIL_EMAIL,
              pass: process.env.GMAIL_PASSWORD
            }
          });
          transporterOwner.sendMail({
            from: '"Find-My-Help" <${process.env.GMAIL_EMAIL}>',
            to: ownerDetail.email,
            subject: subjectOwner,
            text: messageOwner,
            html: `<b>${messageOwner}</b>`
          })
        })
    })

  Service.findByIdAndUpdate(serviceId,
    { $set: { acceptedToken: true, serviceProvider: req.user._id } } )
    .then(res.render('auth/requested'))
});

// Ratings

authRoutes.get("/auth/rate/:serviceId", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let serviceId = req.params.serviceId
  Service.findById(serviceId)
    .then(serviceDetail => {
      res.render("auth/rate", { serviceDetail });
    })
    .catch((error) => {
      console.log(error)
    })
});

authRoutes.post("/auth/rated/:serviceId", ensureLogin.ensureLoggedIn(), (req, res, next) => {

  serviceId = req.params.serviceId;

  let newRating = new Rating({
    rate: req.body.inlineRadioOptions,
    text: req.body.comment,
    requestId: serviceId,
    ownerId: req.user.username,
    providerId: "",

  });

  newRating.save((err) => {
    if (err) {
      console.log(err);
    }
  });

  Service.findByIdAndUpdate(serviceId,
    { $set: { ratedToken: true } } )



  Service.findById(serviceId)
    .then(serviceDetail => {
      Rating.findByIdAndUpdate(newRating._id,
        { $set: { providerId: serviceDetail.serviceProvider } })
      User.findByIdAndUpdate(serviceDetail.serviceProvider,
        { $set: { lastRating: newRating.rate } })
        .then(res.render("auth/rated"))
        .catch((error) => {
          console.log(error)
        })
    })
});

authRoutes.get("/auth/rated", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("auth/rated", { user: req.user });
});

// Delete profile

authRoutes.get("/auth/delete-profile", ensureLogin.ensureLoggedIn(), (req, res, next) => {

  User.deleteOne(req.user._id)
    .then(res.render("/"))
    .catch((error) => {
      console.log(error)
    })
});


module.exports = authRoutes;
