var MongoTools;
MongoTools = {
    getChunkCounts: function (crimes, handler) {
        crimes.aggregate(
            [{
                $match: {
                    $and: [
                        { longitude: { $ne: 181 } },
                        { latitude: { $ne: 181 } }
                    ]
                }
            }, { $group: { _id: '$chunk', count: { $sum: 1 } } }],
            handler
        )
    },
    findByChunk: function (crimes, chunkId, handler) {
        crimes.aggregate(
            [{ $group: { _id: '$chunk', count: { $sum: 1 } } }],
            handler
        )
    },
    getChunk: function (coord) {
        return Math.floor(coord * 10);
    },
    getChunkId: function (xChunk, yChunk) {
        return xChunk.toString() + '_' + yChunk.toString();
    },
    chunks: function (crimes, handler) {
        this.bounds(crimes, ['longitude', 'latitude'], function (err, bounds) {
            if (err) {
                handler(err, bounds);
                return;
            }
            bounds = bounds[0];
            var report = {
                bounds: bounds,
                min: {
                    x: bounds.longitude_min,
                    y: bounds.latitude_min
                },
                max: {
                    x: bounds.longitude_max,
                    y: bounds.latitude_max
                },
                diff: {
                    y: bounds.latitude_max - bounds.latitude_min,
                    x: bounds.longitude_max - bounds.longitude_min
                },
                grid: {
                    size: {}
                },
                chunk: {
                    min: {},
                    max: {}
                }
            };
            report.chunk.min.x = MongoTools.getChunk(report.min.x);
            report.chunk.min.y = MongoTools.getChunk(report.min.y);
            report.chunk.max.x = MongoTools.getChunk(report.max.x);
            report.chunk.max.y = MongoTools.getChunk(report.max.y);
            report.grid.size.x = Math.abs(report.chunk.max.x - report.chunk.min.x) + 1;
            report.grid.size.y = Math.abs(report.chunk.max.y - report.chunk.min.y) + 1;
            MongoTools.getChunkCounts(crimes, function (err, counts) {
                report.chunk.counts = counts;
                handler(null, report);
            });
        });
    },
    bounds: function (collection, targetFields, then) {

        var group = { _id: {} };
        for (var i = 0; i < targetFields.length; i++) {
            var field = targetFields[i];
            group[field + '_min'] = {
                $min: '$' + field
            };
            group[field + '_max'] = {
                $max: '$' + field
            };
        }
        collection.aggregate(
            [
                {
                    $match: {
                        $and: [
                            { longitude: { $ne: 181 } },
                            { latitude: { $ne: 181 } }
                        ]
                    }
                },
                {
                    $group: group
                }
            ],
            then
        );
    }
};
module.exports = MongoTools;