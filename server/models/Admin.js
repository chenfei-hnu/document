var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var AdminSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, '用户名非法'], index: true },
  email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, '邮箱非法'], index: true },
  image: String,
  modelReadRight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }],
  modelWriteRight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }],
  hash: String,
  salt: String
}, { timestamps: true });
AdminSchema.plugin(uniqueValidator, { message: 'is already taken.' });

AdminSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

AdminSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

AdminSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

AdminSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    image: this.image
  };
};

AdminSchema.methods.toProfileJSONFor = function () {
  return {
    username: this.username,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
  };
};


mongoose.model('Admin', AdminSchema);
