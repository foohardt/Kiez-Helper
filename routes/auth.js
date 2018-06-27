const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const Service = require('../models/Service');
const Ratin = require('../models/Rating');
const authRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');
const nodemailer = require("nodemailer");


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
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    location: req.body.location,
    time: req.body.date,
    requestOwner: req.user.id, serviceDetail
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

  Service.findById(serviceId)
    .then(serviceDetail => {
      res.render("auth/service-detail", { serviceDetail });
    })
    .catch((error) => {
      console.log(error)
    })
});

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
          let messageProvider = "Thank you for answering " + serviceDetail.title + " by " + ownerDetail.username + ". Please contact " + ownerDetail.email + " to get in touch with " + ownerDetail.username + "." ;
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
          let messageOwner = "Your request has been answered by " + req.user.username + ", who will contact you shortly. As soon as the service is fullfilled you may rate the fullfillment in the following link: http:/localhost:3000/auth/rate/" + req.params.serviceId + ".";
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
            .then(info => res.render('auth/requested'))
            .catch(error => console.log(error));
        })
        .catch((error) => {
          console.log(error)
        })
    })
});

authRoutes.get("/auth/rate/:serviceId", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let serviceId = req.params.serviceId
  res.render("auth/rate", { serviceId } );
});

authRoutes.post("/auth/rate/:serviceId", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  console.log(req.body)
  serviceId = req.params.serviceId;
  console.log(serviceId);
  
  Service.findById(serviceId)
  .then(serviceDetail => {
    console.log(serviceDetail)
  })


  res.render("auth/private-page");
});


module.exports = authRoutes;
