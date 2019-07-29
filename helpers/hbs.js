'use strict';

module.exports = {
  truncate: function(a, c) {
    if (a.length > c && a.length > 0) {
      let b = a.substr(0, c);
      b = a.substr(0, b.lastIndexOf(' '));
      b = (b.length > 0) ? b : a.substr(0, c);
      return `${b} ...`;
    }
    return a;
  },
  isEqual: function(a, b) {
    return a === b;
  },
};
