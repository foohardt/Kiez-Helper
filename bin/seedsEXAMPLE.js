const mongoose = require('mongoose');
const Book = require('../models/book');

const dbName = 'awesome-project';
mongoose.connect(`mongodb://localhost/${dbName}`);

Book.deleteMany()
.then(() => Book.create(books) )
.then(booksDocuments => {
    console.log('Createt books')
    mongoose.connection.close()
  })
.catch(err => {throw(err)})

const books = [
  {
    title: "The Hunger Games",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "Suzanne Collins",
    rating: 10
  },
  {
    title: "Harry Potter",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "J.K. Rowling ",
    rating: 9
  },
]

Book.create(books, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${books.length} books`)
  mongoose.connection.close()
});