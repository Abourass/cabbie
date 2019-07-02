'use strict';

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.flash('error_msg', ' Not Authorized. If you just failed logging in, you may have the wrong password / email');
    res.redirect('/');
  },
};
