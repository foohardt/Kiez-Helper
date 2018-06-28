const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ratingSchema = new Schema({
  rate: { type: Number },
  text: { type: String }, 
  date: { type: Date },
  ownerId: {type: Schema.Types.ObjectId, ref: 'User'},
  providerId: {type: Schema.Types.ObjectId, ref: 'User'},
  requestId: {type: Schema.Types.ObjectId, ref: 'Service'},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;