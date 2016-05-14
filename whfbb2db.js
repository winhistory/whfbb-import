'use strict';

var _ = require('lodash');

var Writable = require('stream').Writable;
var inherits = require("util").inherits;

var mongoose = require('mongoose');
var JSONStream = require('JSONStream');

mongoose.connect('mongodb://127.0.0.1:27017/whfdb');

var schema = new mongoose.Schema({}, {strict: false})
var models = {
  forums: mongoose.model('Forum', schema),
  posts: mongoose.model('Post', schema),
  threads: mongoose.model('Thread', schema)
}

function MongoWritable (options) {
  if (! (this instanceof MongoWritable))
    return new MongoWritable(options);
  if (! options) options = {};
  options.objectMode = true;
  this.options = options;
  Writable.call(this, options);
}

inherits(MongoWritable, Writable);

MongoWritable.prototype._write = function(obj, encoding, next) {
  var thing = models[this.options.type];
  var q = {};
  q[this.options.field] = _.property(this.options.field)(obj);
  thing.findOneAndUpdate(q, obj, {upsert: true}, next);
};


var jsonParser = JSONStream.parse(false);




process.stdin
  .pipe(jsonParser)
  .pipe(new MongoWritable({type: process.argv[2], field: process.argv[3]}))
  .on('finish', function (err) {
    if (err) {
      console.log(err);
      return process.exit(1);
    }
    return process.exit(0);
  });
