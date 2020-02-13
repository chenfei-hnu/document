var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var slug = require('slug');
var secret = require('../config').secret;

var ModelSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  name: { type: String, lowercase: true, unique: true, required: [true, "模块名称不能为空"] },
  desc: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

ModelSchema.plugin(uniqueValidator, { message: 'is already taken.' });
ModelSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});
ModelSchema.methods.slugify = function () {
  this.slug = slug(this.name) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};
ModelSchema.methods.toJSONFor = function (admin) {
  return {
    slug: this.slug,
    name: this.name,
    desc: this.desc,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    creator: this.creator.toProfileJSONFor(admin)
  };
};
mongoose.model('Model', ModelSchema);
