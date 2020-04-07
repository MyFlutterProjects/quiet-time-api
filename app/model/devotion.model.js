const mongoose = require('mongoose'), Schema = mongoose.Schema;

const DevotionSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  username: String,
  user: [{type: Schema.ObjectId, ref: 'User'}]
},
{
  timestamps: true
});
module.exports = mongoose.model('Devotion', DevotionSchema);
