var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Admin = mongoose.model('Admin');
var auth = require('../auth');

router.get('/admin', auth.required, function (req, res, next) {
  Admin.findById(req.payload.id).then(function (admin) {
    if (!admin) { return res.sendStatus(401); }

    return res.json({ admin: admin.toAuthJSON() });
  }).catch(next);
});

router.put('/admin', auth.required, function (req, res, next) {
  Admin.findById(req.payload.id).then(function (admin) {
    if (!admin) { return res.sendStatus(401); }

    // only update fields that were actually passed...
    if (typeof req.body.admin.username !== 'undefined') {
      admin.username = req.body.admin.username;
    }
    if (typeof req.body.admin.email !== 'undefined') {
      admin.email = req.body.admin.email;
    }
    if (typeof req.body.admin.image !== 'undefined') {
      admin.image = req.body.admin.image;
    }
    if (typeof req.body.admin.password !== 'undefined') {
      admin.setPassword(req.body.admin.password);
    }

    return admin.save().then(function () {
      return res.json({ admin: admin.toAuthJSON() });
    });
  }).catch(next);
});

router.post('/admins/login', function (req, res, next) {
  if (!req.body.admin.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.admin.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: false }, function (err, admin, info) {
    console.log('err', err);
    console.log('admin', admin);
    console.log('info', info);
    if (err) { return next(err); }

    if (admin) {
      admin.token = admin.generateJWT();
      return res.json({ admin: admin.toAuthJSON() });
    } else {
      return res.status(422).json({ errors: info });
    }
  })(req, res, next);
});

router.post('/admins', function (req, res, next) {
  var admin = new Admin();

  admin.username = req.body.admin.username;
  admin.email = req.body.admin.email;
  admin.setPassword(req.body.admin.password);

  admin.save().then(function () {
    return res.json({ admin: admin.toAuthJSON() });
  }).catch(next);
});

module.exports = router;
