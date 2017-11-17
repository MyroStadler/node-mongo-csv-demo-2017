var path = require('path');
var fs = require('fs');
var FileTools;
FileTools = {
    list: function(dir, filelist) {
        var files = fs.readdirSync(dir);
        files.forEach(function(file) {
            var fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                filelist = FileTools.list(fullPath, filelist);
            } else {
                filelist.push(fullPath);
            }
        });
        return filelist;
    }
}
module.exports = FileTools;