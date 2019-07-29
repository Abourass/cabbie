'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DictionarySchema = new Schema({
  word: {
    type: String,
  },
  definition: {
    type: String,
  },
  pronunciation: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  dictionaryName: {
    type: String,
  },
});

// Create collection and add Schema
mongoose.model('dictionaries', DictionarySchema);
