var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');

passport.use(new LocalStrategy({
  usernameField: 'admin[email]',
  passwordField: 'admin[password]'
}, function (email, password, done) {
  Admin.findOne({ email: email }).then(function (admin) {
    if (!admin || !admin.validPassword(password)) {
      return done(null, false, { errors: { 'email or password': 'is invalid' } });
    }

    return done(null, admin);
  }).catch(done);
}));

