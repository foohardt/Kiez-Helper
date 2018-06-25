const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const serviceSchema = new Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum : ['Shopping', 'Houshold cleaning', 'Gardening', 'Baby sitting', 'Pet sitting', 
            'Computer services', 'Bureaucracy services', 'Craft work', 'Moving and transportation',
          'Clearing out'],
      required: true
  },
  description: { type: String, required: true },
  location:  { type: String, default: 'Request location', required: true },
  time: { type: Date, required: true },
  _user_id:[{ type: User.Types.ObjectId, ref: '_id'}],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;