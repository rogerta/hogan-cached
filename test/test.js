var express = require('express');

var app = express();

// If are trying to use this example, replace the line below to
//var renderer = require('hogan-cached');
var renderer = require('../index.js');


app.engine('html', renderer.__express);
app.set('view engine', 'html');

app.set('views', './test/views');

// Global Partials: They can be used anywhere
app.set('partials', {
    // Lets define "footer" as a global partial
    'footer': 'partials/footer'
});


app.get('/', function(req, res) {
    res.render('index', {
        title: 'All Test',
        tests: [
            {name: 'Basic', url: 'basic'},
            {name: 'List', url: 'list'},
            {name: 'Lambda', url: 'lambda'},
            {name: 'Partials', url: 'partials'},
            {name: 'ClearCache', url: 'clearcache'}
        ]
    });
});

app.get('/basic', function(req, res) {
    res.render('basic', {
        title: 'Basic Test',
        description: 'Hello there!',
        year: 2016
    });
});

app.get('/list', function(req, res) {
    res.render('list', {
        title: 'List Test',
        names: [
            {name: 'test'},
            {name: 'test2'}
        ]
    });
});

app.get('/lambda', function(req, res) {
    res.render('lambda', {
        title: 'Lambda Test',
        name: 'World',
        center: function() {
            return function(text) {
                return '<div style="text-align: center;">' + text + '</div>';
            };
        },
        logged_in: false
    });
});

app.get('/partials', function(req, res) {
    res.render('partials', {
        title: 'Partial Test',
        name: 'World',
        year: 2016,
        partials: {
            'text': 'partials/text'
        }
    });
});

app.get('/clearcache', function(req, res) {
    renderer.clearCache();
    res.render('basic', {
        'title': 'Cache',
        'description': 'The cache was cleared',
        'year': 2016
    });
});

app.listen(8081);
