'use strict';

var async = require('async');

var Transform = require('stream').Transform;
var inherits = require("util").inherits;

var db = require('./db');

function PostTransformer (options) {
  Transform.call(this, options);
}

inherits(PostTransformer, Transform);

PostTransformer.prototype._transform = function(obj, encoding, next) {
  return TransformPost(obj, next);
};

module.exports = PostTransformer;


function TransformPost(post, callback) {
  async.waterfall([
    async.apply(db.thread, post.tid),
    function(thread, cb) {
      return cb(null, {
        subject: post.subject,
        message: post.message,
        thread: {
          _id: thread ? thread._id : null,
          title: thread ? thread.subject : null
        },
        postedBy: {
          _id: null,
          name: post.username
        },
        _imported: {
          pid: parseInt(post.pid),
          tid: parseInt(post.tid),
          uid: parseInt(post.uid),
          options: {
            smileys: !!post.smilieoff,
            signature: !!post.includesig
          }
        }
      });
    }
  ], callback);
};
