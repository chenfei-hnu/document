var router = require('express').Router();
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');
var Model = mongoose.model('Model');
var Note = mongoose.model('Note');
var auth = require('../auth');

// Preload note objects on routes with ':note'
router.param('note', function (req, res, next, slug) {
  Note.findOne({ slug: slug })
    .populate('creator')
    .then(function (note) {
      if (!note) { return res.sendStatus(404); }

      req.note = note;

      return next();
    }).catch(next);
});


router.get('/', auth.optional, function (req, res, next) {

  var query = {};
  var limit = 100;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }


  Promise.all([
    req.query.model ? Model.findOne({ slug: req.query.model }) : null,
  ]).then(function (results) {
    var model = results[0];
    if (model) {
      query.model = model._id;
    }


    return Promise.all([
      Note.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({ createdAt: 'desc' })
        .populate('creator')
        .exec(),
      Note.count(query).exec(),
      req.payload ? Admin.findById(req.payload.id) : null,
    ]).then(function (results) {

      var notes = results[0];
      var totalCount = results[1];
      var admin = results[2];

      return res.json({
        notes: notes.map(function (notes) {
          return notes.toJSONFor(admin);
        }),
        totalCount: totalCount
      });
    });
  }).catch(next);
});


router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (admin) {
    if (!admin) { return res.sendStatus(401); }

    var note = new Note(req.body.admin);

    note.creator = admin;

    return note.save().then(function () {
      console.log(noye.creator);
      return res.json({ note: note.toJSONFor(admin) });
    });
  }).catch(next);
});

// return a note
router.get('/:note', auth.optional, function (req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.article.populate('creator').execPopulate()
  ]).then(function (results) {
    var admin = results[0];

    return res.json({ note: req.note.toJSONFor(admin) });
  }).catch(next);
});

// update note
router.put('/:note', auth.required, function (req, res, next) {
  Admin.findById(req.payload.id).then(function (admin) {
    console.log('444', req);
    if (req.note.creator._id.toString() === req.payload.id.toString()) {
      if (typeof req.body.note.name !== 'undefined') {
        req.note.name = req.body.note.name;
      }

      if (typeof req.body.note.content !== 'undefined') {
        req.note.content = req.body.note.content;
      }

      req.note.slug = req.params.note;

      req.note.save().then(function (note) {
        return res.json({ note: note.toJSONFor(admin) });
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete note
router.delete('/:note', auth.required, function (req, res, next) {
  return req.note.remove().then(function () {
    return res.sendStatus(204);
  });
});




module.exports = router;
