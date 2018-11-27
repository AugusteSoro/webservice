const express = require('express');
const logger = require('morgan');
const app = express();


const config = require('../config');
const mongoose = require('mongoose');
const User = require('../model/user');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect mongo db
mongoose.connect(config.mongodb, {
  useNewUrlParser: true, 
  useCreateIndex: true
}, err => {
  if (err) {
    console.warn("Can not connect to mongodb server.");
    console.error(err.message);
  }
});

app.use('/users/:id', (req, res) => {
  let { id } = req.params;

  User.findById(id, (err, user) => {
    if (err || (user == null) ){
       res.send({status: {message: 'Aucune information venant de la BD', error: true}, data: err });
    } else {
     
      // Recuperer les valeurs à afficher dans l'objet user
      const dataToDisplay = User.schema.obj;
      dataToDisplay.name = user.name
      dataToDisplay.email = user.email;
      dataToDisplay.password = user.password;
      dataToDisplay.date = user.date;

      res.send({status: {message: 'OK', error: false}, data: dataToDisplay });
    }
 });

});

app.use('/users', (req, res) => {

  User.find((err, user) => {
     if (err || (user == null) ){
        res.send({status: {message: 'Aucune information venant de la BD', error: true}, data: err });
     } else {

      // Recuperer les valeurs à afficher dans l'objet user
      let obj = User.schema.obj;
      let dataToDisplay = new Array(User.schema.obj); // tableau d'objet

      for(var i in user){
        obj.name = user[i].name
        obj.email = user[i].email;
        obj.password = user[i].password;
        obj.date = user[i].date;
        dataToDisplay.push(obj);
      }

      res.send({status: {message: 'OK', error: false}, data: dataToDisplay });

     }
  });
});

module.exports = app;