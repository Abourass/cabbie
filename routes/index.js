'use strict';

const express = require('express');
const csrf = require('csurf');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});
const Dictionary = mongoose.model('dictionary');
const Entries = mongoose.model('entries');

router.get('/', csrfProtection, (req, res) => {
  try {
    Dictionary.find().then((allDictionary) => {
      if (!allDictionary) {
        console.debug('No Dictionaries Found');
        res.render('index/dashboard', {
          csrfToken: req.csrfToken(), // ============================| This create the unique csrfToken that we add to a hidden input to prevent Cross-Site Request Forgery
          title: 'cabbie', // =========================| title is a string that sets the page title
        });
      } else {
        res.render('index/dashboard', {
          dictionary: allDictionary,
          csrfToken: req.csrfToken(), // ============================| This create the unique csrfToken that we add to a hidden input to prevent Cross-Site Request Forgery
          title: 'cabbie', // =========================| title is a string that sets the page title
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

router.get('/show/:name', csrfProtection, (req, res) => {
  try {
    Dictionary.findOne({name: req.params.name}).then((dictionaryFound) => {
      if (!dictionaryFound) {
        console.debug('No Dictionary Found');
        res.render('index/dashboard', {
          csrfToken: req.csrfToken(), // ============================| This create the unique csrfToken that we add to a hidden input to prevent Cross-Site Request Forgery
          title: 'cabbie', // =========================| title is a string that sets the page title
        });
      } else {
        Entries.find({dictionary: dictionaryFound._id}).then((allEntries) => {
          res.render('index/show', {
            dictionary: dictionaryFound,
            entry: allEntries,
            csrfToken: req.csrfToken(), // ============================| This create the unique csrfToken that we add to a hidden input to prevent Cross-Site Request Forgery
            title: 'cabbie', // =========================| title is a string that sets the page title
          });
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/newName', csrfProtection, (req, res) => {
  try {
    const dictionaryName = req.body.dictionaryName;
    const backURL = req.header('Referer') || '/';
    if (dictionaryName === ''){
      res.redirect(backURL);
    } else {
      Dictionary.findOne({name: dictionaryName}).then((foundDictionary) => {
        if (!foundDictionary) {
          const newDictionary = new Dictionary({
            name: req.body.dictionaryName,
          });
          newDictionary.save().catch(err => console.error(err));
          res.redirect(`../view/${newDictionary.name}`);
        } else {
          res.redirect(backURL);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
});

router.post('/newEntry', csrfProtection, (req, res) => {
  try {
    const backURL = req.header('Referer') || '/';
    const currentDictionaryID = req.body.currentDictionaryID;
    const entryWord = req.body.word;
    const entryDefine = req.body.definition;
    const entryPronun = req.body.pronunciation;
    if (entryWord === '' || entryDefine === '' || entryPronun === '' || currentDictionaryID === ''){
      res.redirect(backURL);
    } else {
      const newEntry = new Entries({
        word: entryWord,
        definition: entryDefine,
        pronunciation: entryPronun,
        dictionary: currentDictionaryID,
      });
      newEntry.save().catch(err => console.error(err));
      res.redirect(backURL);
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
