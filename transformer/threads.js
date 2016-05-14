'use strict';

var async = require('async');

var Transform = require('stream').Transform;
var inherits = require("util").inherits;

function ThreadTransformer (options) {
  Transform.call(this, options);
}

inherits(ThreadTransformer, Transform);

ThreadTransformer.prototype._transform = function(obj, encoding, next) {
  return TransformThread(obj, next);
};

module.exports = ThreadTransformer;


function TransformThread(thread, callback) {
  async.waterfall([
    function(cb) {
      return cb(null, {
        subject: thread.subject,
        createdBy: {
          _id: null,
          name: thread.username
        },
        createdAt: new Date(thread.dateline * 1000), // UTC?
        _imported: {
          fid: parseInt(thread.fid),
          tid: parseInt(thread.tid),
          uid: parseInt(thread.uid)
        }
      });
    }
  ], callback)
};
