var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;
var slug = require('slug');

var NoteSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  name: { type: String, required: [true, "文章标题不能为空"] },
  content: { type: String },
  model: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });
NoteSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

NoteSchema.methods.slugify = function () {
  this.slug = slug(this.name) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

NoteSchema.methods.toJSONFor = function (admin) {
  return {
    slug: this.slug,
    name: this.name,
    content: this.content,
    creator: this.creator.toProfileJSONFor(admin)
  };
};

mongoose.model('Note', NoteSchema);
