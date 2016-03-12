var hogan = require('hogan.js');
var fs = require('fs');
var path = require('path');

var cache = {};

function getTemplate(filePath, cacheEnabled) {
    if(!cacheEnabled || cache[filePath] === undefined) {
        var content = '';
        try {
            content = fs.readFileSync(filePath, 'utf8');
        } catch(e) {}

        if(!cacheEnabled) return hogan.compile(content);

        cache[filePath] = hogan.compile(content);
    }
    return cache[filePath];
}

function getPartials(partialPaths, basedir, ext, partials, cacheEnabled) {
    if(!partials) partials = {};
    for(var partialPath in partialPaths) {
        var p = path.join(basedir, partialPaths[partialPath] + '.' + ext);
        partials[partialPath] = getTemplate(p, cacheEnabled);
    }
    return partials;
}

module.exports = function(filePath, options, callback) {
    var basedir = options.settings['views'] || path.dirname(filePath);
    var ext = options.settings['view engine'] || 'html';

    var partialPaths = options.settings['partials'] || {};
    var partials = getPartials(partialPaths, basedir, ext);

    var cacheEnabled = options.settings['hogan cache'] !== undefined ? options.settings['hogan cache'] : true;

    if(options.partials !== undefined) {
        partials = getPartials(options.partials, basedir, ext, partials, cacheEnabled);
    }

    var template = getTemplate(filePath, cacheEnabled);
    callback(null, template.render(options, partials));
};

module.exports.clearCache = function() {
    cache = {};
};