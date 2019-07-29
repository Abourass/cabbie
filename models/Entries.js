'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const EntrySchema = new Schema({
  word: {
    type: String,
  },
  definition: {
    type: String,
  },
  pronunciation: {
    type: String,
  },
  added: {
    type: Date,
    default: Date.now,
  },
  dictionary: {
    type: Schema.Types.ObjectId,
    ref: 'dictionary',
  },
});

// Create collection and add Schema
mongoose.model('entries', EntrySchema);
