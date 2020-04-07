const config  = require('../config/config.js');
const Role = require('../model/role.model.js');
const User = require('../model/user.model.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


exports.signup = (req,res) => {
  // Save User to Databse
  console.log("Processing func -> SignUp");
  console.log(req.body);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      residence: req.body.residence,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    // Sasve a user to the MongoDb
    user.save().then(savedUser => {
      Role.find({
        'name': { $in: req.body.roles.map(role => role.toUpperCase()) }
      }, (err,roles) => {
        if(err)
        res.status(500).send({ reason: err.message });

        // updare user with Roles
        savedUser.roles = roles.map(role => role._id);
        savedUser.save(function(err) {
          if (err)
          res.status(500).send({reason: err.message });

          res.status(201).send({ message: "User created successfully!"});
        });
      });
    }).catch(err => {
      res.status(500).send({ reason: err.message  });
    });
  }



exports.signin = (req, res) => {
  console.log("Sign - In");
  console.log(req.body);
  if (req.body.username == null || req.body.password == null)
     return res.status(400).send({ message: "Please provide a username and password!"});

  User.findOne({ username: req.body.username})
  .exec((err, user) => {
    console.log(user);
    if(err){
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with username = " + req.body.username
        });
      }
      return res.status(500).send({
        message: "Error retrieving User with Username = " + req.body.username
      });
    }

    if(!user){
      return res.status(401).send({
        // user does not exiist
        auth: false, accessToken: null,
        reason: "Invalid username or password"
      });
    }else{

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if(!passwordIsValid) {
        // wrong password
        return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid username or password !'});
      }

      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      var authorities = [];
      Role.find({
        '_id':{ $in: user.roles}
      }, (err, roles) => {
        if(err)
          res.status(500).send({ message: 'Unable to login user consult system admin'});
        var authorities = [];
        for(let i =0; i<roles.length; i++) {
          // let role = roles[i].name.toUpperCase();
          authorities.push('ROLE_' + roles[i].name.toUpperCase());

        }
        return res.status(200).send({ 
          auth: true,
          id:user._id,
          accessToken: token,
          username: user.username,
          firstName: user.firstName,
          authorities: authorities });

      });
    }
   });
}

exports.userContent = (req, res) => {

  User.findOne({ _id: req.userId })
  // .select('-__v -password') // exclude -> no longer needed implemented in model
  .populate('roles', '-_id -__v')
  .exec((err,user) => {
    if(err) {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with _id = " + req.userId
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id = " + req.userId
      });
    }
    res.status(200).json({
      "description": "User content Page",
      "user": user
    });
  });
}

// get users 
exports.getAllUsers = (req, res) => {
  User.find()
  .then(users => { 
    res.send(users);
  }).catch(err => { 
    res.status(500).send({ message: err.message });
  });
};

exports.updateUser = (req, res) => {
  console.log('Update user');
  if (!(req.body.firstName && req.body.lastName &&
     req.body.username && req.body.gender && req.body.dateOfBirth
     && req.body.residence && req.body.email)) {
     console.log('Required data not passed');
     return res.status(500).send({ message: "Ensure that you provide the required data for updating user information: (first name, last name, user name, gender, date of birth, email, residence)"});
     }

  const id = req.params.userId;
  
  User.findByIdAndUpdate(id, { 
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    residence: req.body.residence,
    email: req.body.email
  }, {new: true})
  .then(user => {
    if(!user) {
      return res.status(404).send({ message: "user not found with id " + id});
    }
    res.send(user);
  }).catch(err => { 
    if (err.kind == 'ObjectId') 
     return res.status(404).send({ message: 'User not found '});
  
     return res.status(500).send({ message: "Error updating with"});
  });

}

exports.adminBoard = (req, res) => {
  User.findOne({ _id: req.userId })
  .select('-_id -__v -password')
  .populate('roles', '-_id -__v')
  .exec((err,user) => {
    if(err) {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with _id = " + req.userId
        });
      }
      return res.status(500).send({
        "description": "Can not access Admin Board",
        "error": err
      });
      return;
    }
    res.status(200).json({
      "description": "Admin Board",
      "user": user
    });
  });
}

exports.managementBoard = (req, res) => {
  User.findOne({ _id: req.userId })
  .select('-_id -__v -password')
  .populate('roles', '-_id -__v')
  .exec((err,user) => {
    if(err) {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with _id = " + req.userId
        });
      }
      return res.status(500).send({
        "description": "Can not access Management Board",
        "error": err
      });
      return;
    }
    res.status(200).json({
      "description": "Manager's Board",
      "user": user
    });
  });
}

