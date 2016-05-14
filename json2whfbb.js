'use strict';

var JSONStream = require('JSONStream');

var PostTrans = require('./transformer/posts');
var ForumTrans = require('./transformer/forums');
var ThreadTrans = require('./transformer/threads');

var jsonParser = JSONStream.parse(false);
var jsonStringify = JSONStream.stringify(false);

var transformer = null;
switch (process.argv[2]) {
  case 'posts':
    transformer = new PostTrans({objectMode: true});
    break;
  case 'forums':
    transformer = new ForumTrans({objectMode: true});
    break;
  case 'threads':
    transformer = new ThreadTrans({objectMode: true});
    break;
  default:
    console.error('transformer \'' + process.argv[2] + ' is not valid');
    process.exit(1);
    break;
}

process.stdin
  .pipe(jsonParser)
  .pipe(transformer)
  .pipe(jsonStringify)
  .pipe(process.stdout)
  .on('finish', function (err) {
    if (err) {
      console.log(err);
      return process.exit(1);
    }
    return process.exit(0);
  });
