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
  _user_id:[{ type: Schema.Types.ObjectId, ref: '_id'}],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;