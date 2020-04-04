const config = require('../config/config.js');
const ROLEs = config.ROLEs;
const User = require('../model/user.model.js');

checkForAllRequiredField = (req, res, next) => { 
  console.log('Checking required fields');
  console.log(req.body);

  // if request body is empty
  if (Object.keys(req.body).length == 0) {
      console.log('User did not pass any data');
      res.status(400).send({ error: "Please enter the required fields!"});
      return
  }

  // -> check if username is already in use
  if (req.body.username == null ) {   
    emptyData('Username');
  } else if (req.body.firstName == null) {
    emptyData('First name');
  } else if (req.body.lastName == null) { 
    emptyData('Last name');
  } else if (req.body.gender == null) {
    emptyData('Gender');
  } else if (req.body.password == null) {
    emptyData('Password');
  } else if (req.body.dateOfBirth == null) {
    emptyData('Date of birth');
  } else if (req.body.roles == null) {
    emptyData('Role');
  } else if (req.body.email == null) {
    emptyData('Email');
  } else{
    next();
  }
  

  function emptyData(field) {
    console.log(field + ' is required!');
    return res.status(400).send({ error:  field + " is empty! "});      
  }

  // if(req.body.firstName)
  
}

checkDuplicateUserNameOrEmail = (req, res, next) => {
  User.findOne({ username: req.body.username })
  .exec((err, user) => {
   if(err && err.kind !== 'ObjectId') {
     res.status(500).send({
       error: "Error retrieving user with username = " + req.body.username
     });
     return;
   }
   if (user) {
     res.status(400).send({ error: "Username is already taken!"});
     return
   }
   
   // Email
   User.findOne({ email: req.body.email })
   .exec((err, user) => {
     if (err && err.kind !== 'ObjectId') {
       res.status(500).send({
         error: "Error retrieving user with Email = " + req.body.email
       });
       return;
     }
     if(user) {
       res.status(400).send({ error: "Email is already in use"});
       return;
    }
   next();
 });
});
}

checkRoleExisted = (req, res, next) => {
  
  console.log(req.body);
  if (req.body.roles == null){
    res.status(500).send({ error: 'Supply user role'});
    return;
  }
  for(let i=0; i<req.body.roles.length; i++) {
    if(!ROLEs.includes(req.body.roles[i].toUpperCase())){
      res.status(400).send({ error: "No Role = " + req.body.roles[i] });
      return;
    }
  }
  next();
}

const signUpVerify = {};
signUpVerify.checkForAllRequiredField = checkForAllRequiredField;
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVerify.checkRoleExisted = checkRoleExisted;

module.exports = signUpVerify;
