var router = require('express').Router();
var mongoose = require('mongoose');
var Model = mongoose.model('Model');
var Note = mongoose.model('Note');
var Admin = mongoose.model('Admin');
var auth = require('../auth');

// Preload model objects on routes with ':model'
router.param('model', function (req, res, next, slug) {
  Model.findOne({ slug: slug })
    .populate('creator')
    .then(function (model) {
      if (!model) { return res.sendStatus(404); }

      req.model = model;

      return next();
    }).catch(next);
});


router.get('/', auth.optional, function (req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }


  Promise.all([
    req.query.creator ? Admin.findOne({ adminname: req.query.creator }) : null,
  ]).then(function (results) {
    var creator = results[0];

    if (creator) {
      query.creator = creator._id;
    }


    return Promise.all([
      Model.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({ createdAt: 'desc' })
        .populate('creator')
        .exec(),
      Model.count(query).exec(),
      req.payload ? Admin.findById(req.payload.id) : null,
    ]).then(function (results) {
      var models = results[0];
      var totalCount = results[1];
      var admin = results[2];

      return res.json({
        models: models.map(function (model) {
          return model.toJSONFor(admin);
        }),
        totalCount: totalCount
      });
    });
  }).catch(next);
});


router.post('/', auth.required, function (req, res, next) {
  console.log(req.payload);
  Admin.findById(req.payload.id).then(function (admin) {
    if (!admin) { return res.sendStatus(401); }

    var model = new Model(req.body.model);

    model.creator = admin;

    return model.save().then(function () {
      console.log(model.creator);
      return res.json({ model: model.toJSONFor(admin) });
    });
  }).catch(next);
});

// return a model
router.get('/:model', auth.optional, function (req, res, next) {
  Promise.all([
    req.payload ? Admin.findById(req.payload.id) : null,
    req.model.populate('creator').execPopulate()
  ]).then(function (results) {
    var admin = results[0];

    return res.json({ model: req.model.toJSONFor(admin) });
  }).catch(next);
});

// update model
router.put('/:model', auth.required, function (req, res, next) {
  Admin.findById(req.payload.id).then(function (admin) {
    if (req.model.creator._id.toString() === req.payload.id.toString()) {
      if (typeof req.body.model.name !== 'undefined') {
        req.model.name = req.body.model.name;
      }

      if (typeof req.body.model.desc !== 'undefined') {
        req.model.desc = req.body.model.desc;
      }


      req.model.save().then(function (model) {
        return res.json({ model: model.toJSONFor(admin) });
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete model
router.delete('/:model', auth.required, function (req, res, next) {
  Admin.findById(req.payload.id).then(function (admin) {
    if (!admin) { return res.sendStatus(401); }

    if (req.model.creator._id.toString() === req.payload.id.toString()) {
      return req.model.remove().then(function () {
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

// create a new note
router.post('/:model/notes', auth.required, function (req, res, next) {
  Admin.findById(req.payload.id).then(function (admin) {
    if (!admin) { return res.sendStatus(401); }
    var note = new Note(req.body.note);
    note.model = req.model;
    note.creator = admin;

    return note.save().then(function () {
      return res.json({ note: note.toJSONFor(admin) });
    });
  }).catch(next);
});

module.exports = router;
