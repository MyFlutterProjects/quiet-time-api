
const Devotion = require('../model/devotion.model.js');


exports.createDevotion = ( req, res) => {
    console.log('Processing func -> create devotion');
    const  devotion = Devotion({
      title: req.body.title,
      body: req.body.body,
      user: req.body.user
  
    });

    devotion.save(function(error) {
      console.log(error.message);
      if (error) return res.status(500).send({ error: error.message });
    
      res.status(201).send({ message: "Devotion created successfully!"});
    });
  
  }
  
  exports.getDevotions = (req, res) => {
    console.log('Get devotions --- ');
    Devotion.find()
    .populate('user')
    .then(devotions => {
      res.send(devotions);
    }).catch(err => {
      res.status(500).send({ 
        message: err.message
      });
    });
  };


  // get user's devotions 
  exports.findByUserId = (req, res) => {
      var id = req.params.userId;
      Devotion.find({ user:id })
      .exec(function(err, devotions) {
        if (err) return res.send(err);
  
          res.send(devotions);
      });

  };

  exports.update  = (req, res) => { 
    const id = req.params.devotionId;
    console.log('Updating devotion');
    Devotion.findByIdAndUpdate(id, req.body, {new: true})
    .then(devotion => { 
      if(!devotion) { 
        return res.status(404).send({ message: "No devotion with id " + id });
      }
       return res.status(200).send({ message: "Devotion updated successfully"});
          }).catch(err => {
            console.log(err);
            if (err.kind === 'ObjectId') {
              return res.status(404).send({ message: "No devotion with id " + id });
            }
            return res.status(500).send({message: error.message });
          });
  }