var router = require('express').Router();
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');
var auth = require('../auth');

// Preload admin profile on routes with ':username'
router.param('username', function (req, res, next, username) {
  Admin.findOne({ username: username }).then(function (admin) {
    if (!admin) { return res.sendStatus(404); }

    req.profile = admin;

    return next();
  }).catch(next);
});

router.get('/:username', auth.optional, function (req, res, next) {
  if (req.payload) {
    Admin.findById(req.payload.id).then(function (admin) {
      if (!admin) { return res.json({ profile: req.profile.toProfileJSONFor(false) }); }

      return res.json({ profile: req.profile.toProfileJSONFor(admin) });
    });
  } else {
    return res.json({ profile: req.profile.toProfileJSONFor(false) });
  }
});

router.post('/:username/follow', auth.required, function (req, res, next) {
  var profileId = req.profile._id;

  Admin.findById(req.payload.id).then(function (admin) {
    if (!admin) { return res.sendStatus(401); }

    return admin.follow(profileId).then(function () {
      return res.json({ profile: req.profile.toProfileJSONFor(admin) });
    });
  }).catch(next);
});

router.delete('/:username/follow', auth.required, function (req, res, next) {
  var profileId = req.profile._id;

  Admin.findById(req.payload.id).then(function (admin) {
    if (!admin) { return res.sendStatus(401); }

    return admin.unfollow(profileId).then(function () {
      return res.json({ profile: req.profile.toProfileJSONFor(admin) });
    });
  }).catch(next);
});

module.exports = router;
