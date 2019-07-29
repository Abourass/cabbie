'use strict';

const express = require('express');
const csrf = require('csurf');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});
const Dictionary = mongoose.model('dictionaries');

router.get('/', csrfProtection, (req, res) => {
  try {
    Dictionary.findOne({dictionaryName: 'du'}).then((dictionaryFound) => {
      if (!dictionaryFound) {
        res.render('index/dashboard', {
          csrfToken: req.csrfToken(), // ============================| This create the unique csrfToken that we add to a hidden input to prevent Cross-Site Request Forgery
          title: 'cabbie', // =========================| title is a string that sets the page title
        });
      } else {
        res.render('index/dashboard', {
          dictionaryEntry: dictionaryFound,
          csrfToken: req.csrfToken(), // ============================| This create the unique csrfToken that we add to a hidden input to prevent Cross-Site Request Forgery
          title: 'cabbie', // =========================| title is a string that sets the page title
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
