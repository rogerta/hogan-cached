var hogan = require('hogan.js');
var fs = require('fs');
var path = require('path');

var cache = {};

var options = {
    cache: true
};

function getTemplate(filePath, cacheEnabled, hoganOptions) {
    if(!cacheEnabled || cache[filePath] === undefined) {
        var content = '';
        try {
            content = fs.readFileSync(filePath, 'utf8');
        } catch(e) {}

        if(!cacheEnabled) return hogan.compile(content, hoganOptions);

        cache[filePath] = hogan.compile(content, hoganOptions);
    }
    return cache[filePath];
}

function getPartials(partialPaths, basedir, ext, cacheEnabled, hoganOptions, partials) {
    if(!partials) partials = {};
    if(ext.length > 0 && ext.substring(0, 1) != '.') ext = '.' + ext;
    for(var partialPath in partialPaths) {
        var p = path.join(basedir, partialPaths[partialPath] + ext);
        partials[partialPath] = getTemplate(p, cacheEnabled, hoganOptions);
    }
    return partials;
}

module.exports.setCacheEnabled = function(b) {
    options.cache = b;
};

module.exports.clearCache = function() {
    cache = {};
};

module.exports.__express = function(filePath, options, callback) {
    var basedir = options.settings['views'];
    var ext = options.settings['view engine'] || 'html';

    var cacheEnabled = options.settings['hogan cache'] !== undefined ? options.settings['hogan cache'] : options.cache;
    var hoganOptions = options.settings['hogan options'] || {};

    var partialPaths = options.settings['partials'] || {};
    var partials = getPartials(partialPaths, basedir, ext, cacheEnabled, hoganOptions);

    if(options.partials !== undefined) {
        partials = getPartials(options.partials, basedir, ext, cacheEnabled, hoganOptions, partials);
    }

    var template = getTemplate(filePath, cacheEnabled, hoganOptions);
    callback(null, template.render(options, partials));
};
