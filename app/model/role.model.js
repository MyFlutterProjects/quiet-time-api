const mongoose = require('mongoose'), Schema = mongoose.Schema;
const RoleSchema = mongoose.Schema({
  name: String
},
{
  timestamps: true
});
module.exports = mongoose.model('Role', RoleSchema);
