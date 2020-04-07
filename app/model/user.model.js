   const Role = require('./role.model.js');
   const mongoose = require('mongoose'),
     Schema = mongoose.Schema;

   const UserSchema = mongoose.Schema({
     firstName: String,
     lastName: String,
     username:{type: String, required: true },
     dateOfBirth: Date,
     gender: String,
     email: String,
     residence: String,
     registeredFrom: String, // location
     password: String,
     active: { type: Boolean,default: true},
     roles: [{ type: Schema.Types.ObjectId, ref: 'Role'}],
    //  devotions: [{ type: Schema.Types.ObjectId, ref: 'Devotion' }],

   },
   {
     timestamps: true
   });


   // do not return password
   UserSchema.methods.toJSON = function () {
     var obj = this.toObject();
     delete obj.password;
     return obj;
   }
   module.exports = mongoose.model('User', UserSchema);