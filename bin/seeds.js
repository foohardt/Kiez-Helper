const mongoose  = require('mongoose');
const User      = require('../models/User');
const Service   = require('../models/Service');
const Rating    = require('../models/Rating');

const dbName = 'find-my-help';
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = [
  {
  username: "test",
  password: "test", 
  email:    "test@test.de",
  picture:  "",
  avgRating: 3,
  },
{

}
];
const services = [];
const ratings = [];

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close()
});