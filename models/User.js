const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email:    { type: String, required: true },
  picture:  { type: String, default: ''},
  pictureUrl: String,
  avgRating: { type: Number, default: 0},
  _rating_id:[{ type: Schema.Types.ObjectId, ref: '_id'}],
  _currentService_id:[{ type: Schema.Types.ObjectId, ref: '_id'}],
  servicesDone: Number,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
