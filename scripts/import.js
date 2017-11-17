
var path = require('path');
var fs = require('fs');
var parse = require('csv-parse');
var fileTools = require('../modules/file-tools');
var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongo.Db('help-tha-police-db', server);

db.open(function(err, db) {
    if(err) {
        console.log(err);
        process.exit();
    }
    db.collection('crimes').drop();
    var fileList = fileTools.list(
        path.join(process.cwd(), 'assets/crimes-data-import'), 
        []
    );
    var filePointer = 0;
    var nextFile = function() {
        console.log('...nextfile');
        if(filePointer >= fileList.length) {
            console.log('done');
            process.exit();
        }
        console.log('Importing file number ' + (filePointer+1) + ' of ' + fileList.length);
        var csvPath = fileList[filePointer++];
    
        db.collection('crimes', {safe:true}, function(err, collection) {
            fs.createReadStream(csvPath)
                .pipe(parse({delimiter: ','}))
                .on('data', function(csvRow) {
                    if(csvRow[0] == 'Crime ID') {
                        return;
                    }  
                    var lat = parseFloat(csvRow[4]);
                    lat = isNaN(lat) ? 181 : lat;
                    var yChunk = Math.floor(lat * 10);
                    var long = parseFloat(csvRow[5]);
                    long = isNaN(long) ? 181 : long;
                    var xChunk = Math.floor(long * 10);
                    var chunk = xChunk.toString() + '_' + yChunk.toString();
                    // console.log('parsed lat', csvRow[4], lat);
                    collection.insert(
                        {
                            crime_id: csvRow[0],
                            month: csvRow[1],
                            reported_by: csvRow[2],
                            falls_within: csvRow[3],
                            latitude: lat,
                            y_chunk: Math.floor(lat * 10),
                            longitude: long,
                            x_chunk: xChunk,
                            chunk: chunk,
                            location: csvRow[6],
                            lsoa_code: csvRow[7],
                            lsoa_name: csvRow[8],
                            crime_type: csvRow[9],
                            last_outcome: csvRow[10],
                            context: csvRow[11]
                        }
                    );
                })
                .on('end',function() {
                    nextFile();
                });
        });
    };
    
    nextFile();
});



