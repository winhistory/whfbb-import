convert:
	cat files/input/boards.csv | node tsv2json.js 1> files/output/boards.json
	cat files/input/forums.csv | node tsv2json.js | node json2whfbb.js forums 1> files/output/forums.json
	cat files/input/threads.csv | node tsv2json.js | node json2whfbb.js threads 1> files/output/threads.json
	cat files/input/posts.csv | node tsv2json.js | node json2whfbb.js posts 1> files/output/posts.json

import:
	cat files/output/forums.json |node whfbb2db.js forums _imported.fid
	cat files/output/threads.json |node whfbb2db.js threads _imported.tid
	cat files/output/posts.json |node whfbb2db.js posts _imported.pid

clean:
	rm -rf files/output/*
