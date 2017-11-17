var mongo = require('mongodb');
var tools = require('../modules/mongo-tools');
var bson = require('bson');
var Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = bson.BSON.ObjectID;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('help-tha-police-db', server);

db.open(function(err, db) {
    if(!err) {
        // db.collection.crimes.drop();
        // console.log('DROPPED');
        // return;
        console.log("Connected to 'help-tha-police-db' database");
        db.collection('crimes', {strict:true}, function(err, collection) {
            if (err) {
                // console.log("The 'crimes' collection doesn't exist. Creating it with sample data...");
                // populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving crime by id: ' + id);
    db.collection('crimes', function(err, collection) {
        if(err) {
            res.send('ERROR ' + err);
            return;
        }
        collection.findOne({'_id':new ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findNoLatOrLong = function(req, res) {
    db.collection('crimes', function(err, collection) {
        if(err) {
            res.send('ERROR ' + err);
            return;
        }
        collection.find({$or: [{ longitude: 181 }, { latitude: 181 }]}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.getChunksReport = function(req, res) {
    db.collection('crimes', function(err, collection) {
        tools.chunks(
            collection,
            function(err, report) {
                res.send(report);
            });
    });
};

exports.findByChunk = function(req, res) {
    var chunkId = req.params.chunk_id;
    db.collection('crimes', function(err, collection) {
        if(err) {
            res.send('ERROR ' + err);
            return;
        }
        collection.find({'chunk':chunkId}).toArray(function(err, results) {
            res.send(results);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('crimes', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addCrime = function(req, res) {
    var crime = req.body;
    console.log('Adding crime: ' + JSON.stringify(crime));
    db.collection('crimes', function(err, collection) {
        collection.insert(crime, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateCrime = function(req, res) {
    var id = req.params.id;
    var crime = req.body;
    console.log('Updating crime: ' + id);
    console.log(JSON.stringify(crime));
    db.collection('crimes', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, crime, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating crime: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(crime);
            }
        });
    });
}

exports.deleteCrime = function(req, res) {
    var id = req.params.id;
    console.log('Deleting crime: ' + id);
    db.collection('crimes', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var crimes = [
        {
            crime_id: '1f5713faf067acef07d93ef10809e8b76734e69a1722c7a0a3767a6358f6a9fe',
            month: '2017-03',
            reported_by: 'Thames Valley Police',
            falls_within: 'Thames Valley Police',
            latitude: -0.969057,
            longitude: 51.994165,
            location: 'On or near Bourton Road',
            lsoa_code: 'E01017648',
            lsoa_name: 'Aylesbury Vale 001A',
            crime_type: 'Criminal damage and arson',
            last_outcome: 'Status update unavailable',
            context: ''
        },
        {
            crime_id: 'dae10c8cf342ca7074ca0c8703ca998c4eff2a0ba7a7bdd325e51ccb30183953',
            month: '2017-03',
            reported_by: 'Thames Valley Police',
            falls_within: 'Thames Valley Police',
            latitude: -0.984891,
            longitude: 52.000506,
            location: 'On or near Supermarket',
            lsoa_code: 'E01017645',
            lsoa_name: 'Aylesbury Vale 002B',
            crime_type: 'Shoplifting',
            last_outcome: 'Unable to prosecute suspect',
            context: ''
        }
    ];

    db.collection('crimes', function(err, collection) {
        collection.insert(crimes, {safe:true}, function(err, result) {});
    });

};