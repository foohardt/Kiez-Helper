const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Rating = require('../models/Rating');

const dbName = 'find-my-help';
mongoose.connect(`mongodb://localhost/${dbName}`);

User.deleteMany()
Service.deleteMany()
Rating.deleteMany()
  .then(() => {
    User.create(users)
    console.log("created users", users.length)
  })
  .then(() => {
    Service.create(services) 
    console.log("created services", services.length)
  })
  .then(() => {
    Rating.create(ratings)
    console.log("created ratings", ratings.length)
  })
  .then(() => {
    mongoose.connection.close()
  })
  .catch(err => { throw (err) })

const users = [
  {
    username: "test0",
    password: "test",
    email: "test0@test.de",
    picture: "",
    avgRating: 3,
  },
  {
    username: "test1",
    password: "test",
    email: "test1@test.de",
    picture: "",
    avgRating: 2,
  }
];
const services = [
  {
    title: "Need help with my cat",
    type: "Pet sitting",
    description: "I need someone to feed my cat while im on vacation. Beware it loves to cuddle.",
    location: "Stalauer Allee 6, 10245 Berlin",
    time: new Date,
  },
  {
    title: "Heavy things to care",
    type: "Moving and transportation",
    description: "I plan to buy new furniture and need someone to bring it upstairs",
    location: "Stalauer Allee 6, 10245 Berlin",
    time: new Date,
  }
];
const ratings = [
  {
    rate: 5,
    text: "Friendly, reliable..I'd book this guy again.",
    date: new Date,
  }
];

// User.create(users, (err) => {
//   if (err) { throw(err) }
//   console.log(`Created ${users.length} users`)
//   mongoose.connection.close()
// });