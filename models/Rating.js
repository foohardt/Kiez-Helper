const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ratingSchema = new Schema({
  rate: { type: Number, required: true },
  text: { type: String, required: true }, 
  date: { type: Date, required: true },
  _user_id:[{ type: User.Types.ObjectId, ref: '_id'}],
  _service_id:[{ type: Service.Types.ObjectId, ref: '_id'}],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;