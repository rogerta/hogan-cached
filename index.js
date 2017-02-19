const hogan = require('hogan.js');
const fs = require('fs');
const path = require('path');

var cache = {};

var options = {
    cache: true
};

function loadTemplate(filePath, hoganOptions) {
    try {
        return hogan.compile(fs.readFileSync(filePath, 'utf8'), hoganOptions);
    } catch(e) {
        return undefined;
    }
}

function getTemplate(filePath, cacheEnabled, hoganOptions) {
    if (!cacheEnabled)
        return loadTemplate(filePath, hoganOptions);

    var templ = cache[filePath];
    if (templ === undefined) {
        templ = loadTemplate(filePath, hoganOptions);
        cache[filePath] = templ;
    }
    return templ;
}

function getPartials(partialPaths, basedir, ext, cacheEnabled, hoganOptions, partials) {
    if(!partials) partials = {};
    for(var partialPath in partialPaths) {
        var p = path.join(basedir, partialPaths[partialPath] + ext);
        partials[partialPath] = getTemplate(p, cacheEnabled, hoganOptions);
    }
    return partials;
}

module.exports.setBaseDir = function(dir) {
    options.basedir = dir;
};

module.exports.setCacheEnabled = function(b) {
    options.cache = b;
};

module.exports.clearCache = function() {
    cache = {};
};

module.exports.getPartialsFrom = function(dir, ext, partials, prefix) {
    partials = partials || {};
    prefix = prefix || '';
    var files = fs.readdirSync(dir);
    var length = files.length;
    for (var i = 0; i < length; ++i) {
        var file = files[i];
        var name = path.join(prefix, path.basename(file));

        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          module.exports.getPartialsFrom(name, ext, partials, name);
          continue;
        }

        if (ext !== path.extname(file))
            continue;

        name = path.join(prefix, path.basename(file, ext));
        partials[name] = name;
    }
    return partials;
};

module.exports.__express = function(filePath, options, callback) {
    var basedir = options.settings['views'];
    var ext = `.${options.settings['view engine'] || 'html'}`;

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