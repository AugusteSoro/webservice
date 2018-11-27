const express = require('express');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../model/user');

const app = express();

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const sendToken = (user, res) => {
  // Signature tu token
  const token = jwt.sign(      {
    id: user._id,
    name: user.name,
    email: user.email
  }, config.secret, {expiresIn: config.tokenExpiration});

  res.send({
    status: {
      message: 'authenticated',
      error: false, 
    },
    data: {
      token,
      crearedAt: Date.now()
    }
  });
};

const formatResponse = (status, data = {}) => {
  return {status, data}
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (typeof email === 'undefined') {
    return res.status(500).send(formatResponse({
      message: 'email or password is not valide !',
      error: true
    }));
  }

  if (typeof password === 'undefined') {
    return res.status(500).send(formatResponse({
      message: 'email or password is not valide !',
      error: true
    }));
  }
  
  User.findOne({ email }, (err, user) => {
    if (err || (user !== null && !bcrypt.compareSync(password, user.password))) {
      return res.status(204).send(formatResponse({
        message: 'email or password is not valide !',
        error: true
      }));
    }

    // Send Token
    return sendToken(user, res);
  });
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  const data = {
    name: name,
    email: email, 
    password: bcrypt.hashSync(password)
  };

  User.create(data, (err, user) => {
    if (err) {
      return res.status(500).send(formatResponse({
        message: 'email or password is invalide !',
        error: true
      }));
    }

    // Send Token
    res.status(201);
    return sendToken(user, res);
  })
});

app.post('/verify', (req, res) => {
  const token = req.headers['x-access-token'];

  if (typeof token === 'undefined') {
    return res.send(formatResponse({
      message: 'Token undefined', 
      error: false
    }));
  }

  jwt.verify(token.trim(), config.secret, (err, decode) => {
    if (err) {
      switch (err.name) {
        case 'TokenExpiredError': {
          return res.status(500).send(formatResponse({
            message: 'Token is expirated', 
            error: true
          }))
        }
        case 'JsonWebTokenError': {
          return res.status(500).send(formatResponse({
            message: 'An error in your Token', 
            error: true
          }))
        }
        default: {
          return res.status(500).send(formatResponse({
            message: 'Token is invalide', 
            error: true
          }));
        }
      }
    }

    User.findById(decode._id, err => {
      if (err) {
        return res.status(500).send(formatResponse({
          message: 'Token is invalide', 
          error: true
        }));
      }

      return res.send(formatResponse({
        message: "Ok", 
        error: false
      }, {
        token, 
        decode
      }));
    });
  });
});

module.exports = app;