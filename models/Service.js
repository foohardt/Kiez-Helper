const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const serviceSchema = new Schema({
  title: { type: String },
  category: {
    type: String,
    enum : ['Shopping', 'Houshold cleaning', 'Gardening', 'Baby sitting', 'Pet sitting', 
            'Computer services', 'Bureaucracy services', 'Craft work', 'Moving and transportation',
          'Clearing out'],
  },
  description: { type: String },
  location:  { type: String, default: 'Request location' },
  time: { type: String },
  requestOwner: { type: String },
  serviceProvider: { type: String, default: '' },
  acceptedToken: { type: Boolean, default: 0 },
  ratedToken: { type: Boolean, default: 0 },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;