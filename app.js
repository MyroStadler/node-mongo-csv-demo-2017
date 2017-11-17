var express = require('express');
var crimes = require('./routes/crimes');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// app.configure(function () {
//     app.use(express.logger('dev'));//      'default', 'short', 'tiny', 'dev' 
//     app.use(express.bodyParser());
// });

app.get('/crimes', crimes.findAll);
app.get('/crimes/nolatorlong', crimes.findNoLatOrLong);
app.get('/crimes/by/chunk/:chunk_id', crimes.findByChunk);
app.get('/crimes/find/:id', crimes.findById);
app.get('/crimes/chunks', crimes.getChunksReport);
app.listen(3000);
console.log('Listening on port 3000...');