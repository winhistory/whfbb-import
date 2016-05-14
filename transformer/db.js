var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/whfdb');

var schema = new mongoose.Schema({}, {strict: false})
var Forums = mongoose.model('Forum', schema);
var Post = mongoose.model('Post', schema);
var Thread = mongoose.model('Thread', schema);

var cache = {
  posts: {},
  forums: {},
  threads: {}
};

module.exports = {
  post: function(postId, callback) {
    var post = cache.posts[postId];
    if (!post) {
      post = Post.findOne({"_imported.pid": parseInt(postId)}, function(err, p) {
        if (err) {
          return callback(err);
        }
        cache.posts[postId] = p;
        callback(err, p);
      });
    } else {
      return callback(null, post);
    }
  },
  forum: function(forumId, callback) {
    var forum = cache.forums[forumId];
    if (!forum) {
      forum = Forum.findOne({"_imported.fid": parseInt(forumId)}, function(err, p) {
        if (err) {
          return callback(err);
        }
        cache.forums[forumId] = p;
        callback(err, p);
      });
    } else {
      return callback(null, forum);
    }
  },
  thread: function(threadId, callback) {
    var thread = cache.threads[threadId];
    if (!thread) {
      thread = Thread.findOne({"_imported.tid": parseInt(threadId)}, function(err, t) {
        if (err) {
          return callback(err);
        }
        cache.threads[threadId] = t;
        callback(err, t);
      });
    } else {
      return callback(null, thread);
    }
  }
}
