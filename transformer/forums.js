'use strict';

var _ = require('lodash');
var async = require('async');

var Transform = require('stream').Transform;
var inherits = require("util").inherits;

var boards = _.keyBy(require('../files/input/boards'), 'fid');

function ForumTransformer (options) {
  Transform.call(this, options);
}

inherits(ForumTransformer, Transform);

ForumTransformer.prototype._transform = function(obj, encoding, next) {
  return TransformForum(obj, next);
};

module.exports = ForumTransformer;


function TransformForum(forum, callback) {
  var parent = boards[boards[forum.fid].pid];
  return callback(null, {
    name: forum.name,
    description: forum.description,
    category: {
      name: parent.name
    },
    _imported: {
      fid: forum.fid,
      pid: parent.fid
    }
  });
};
