'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DictionarySchema = new Schema({
  created: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
  },
});

// Create collection and add Schema
mongoose.model('dictionary', DictionarySchema);
