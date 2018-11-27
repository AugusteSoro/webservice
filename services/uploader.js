const express = require('express');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const md5 = require('md5');
const storage = path.resolve(__dirname + '/../storage');
const Material = require('../model/material');
const config = require('../config');
const verifyToken = require('../middleware/verify-token');
const mongoose = require('mongoose');

const app = express();

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

app.get('/url', (req, res) => {
  const { filename, original } = req.query

  if (typeof filename === 'undefined') {
    return res.send('File not found');
  }

  fs.exists(path.join(storage, filename), (exists, err) => {
    if (!exists) {
      return res.status(404)
        .send('File not found');
    }

    if (typeof original === 'undefined') {
      return res.download(
        path.join(storage, filename), 
        filename
      );
    }

    return Material.findOne({ hashname: path.parse(filename).name }, (err, material) => {
      if (err) {
        return res.download(
          path.join(storage, filename), 
          filename
        );
      }

      return res.download(
        path.join(storage, filename), 
        material.filename
      );
    });
  });
});

app.use(fileUpload({
  limits: 1024 * 20
}));

app.post('/upload', verifyToken(require('../model/user')), (req, res) => {
  if (typeof req.files === 'undefined' || Object.keys(req.files).length == 0) {
    return res.status(500).send({
      message: 'Can not upload file, because file is empty', 
      error: true
    });
  }

  const { file } = req.files;
  const extension = path.parse(file.name).ext;
  const hashname = md5(file.name);

  file.mv(`${storage}/${hashname}${extension}`, (err) => {
    if (err) {
      return res.status(500).send({
        message: err,
        error: true
      });
    }

    Material.create({
      filename: file.name,
      hashname: `${hashname}${extension}`,
      size: file.size,
      path: `${hashname}${extension}`,
      url: `${hashname}${extension}`,
      author: req.decode['_id']
    });

    res.status(201).send({
      message: 'File uploaded!', 
      error: false,
      path: `${hashname}${extension}`
    });
  });
});

module.exports = app;