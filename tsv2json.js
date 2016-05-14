'use strict';

var Transform = require('stream').Transform;
var replaceStream = require('replacestream')
var csv = require('csv-streamify');
var JSONStream = require('JSONStream');


var csvToJson = csv({
    delimiter: '\t',
    quote: 'DUMMKOPFSLIBDIEEMPTYSTRINGNICHTKANN',
    columns: true,
    auto_parse: true,
    auto_parse_dase: true,
    objectMode: true
  });

var parser = new Transform({objectMode: true});
parser._transform = function(data, encoding, done) {
  this.push(data);
  done();
};

var jsonToStrings = JSONStream.stringify(false);

process.stdin
  .pipe(replaceStream(/\n\\n/g, '[-:newline:-]'))
  //.pipe(replaceStream('"', '[:quote:]'))
  .pipe(csvToJson)
  .pipe(parser)
  .pipe(jsonToStrings)
  .pipe(replaceStream('[-:newline:-]', '\\\\n'))
  .pipe(process.stdout);
