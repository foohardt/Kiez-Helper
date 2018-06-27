const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ratingSchema = new Schema({
  rate: { type: Number },
  text: { type: String }, 
  date: { type: Date },
  ownerId: { type: String},
  providerId: { type: String},
  requestId: {type: String}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;