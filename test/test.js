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
    res.send(
        '<p><a href="basic">Basic</a><br/><iframe src="basic"></iframe></p>' +
        '<p><a href="list">List</a><br/><iframe src="list"></iframe></p>' +
        '<p><a href="lambda">Lambda</a><br/><iframe src="lambda"></iframe></p>' +
        '<p><a href="partials">Partials</a><br/><iframe src="partials"></iframe></p>' +
        '<p><a href="getpartialsfrom">Get Partials From</a><br/><iframe src="getpartialsfrom"></iframe></p>' +
        '<p><a href="clearcache">ClearCache</a><br/><iframe src="clearcache"></iframe></p>'
    );
});

app.get('/basic', function(req, res) {
    res.render('index', {
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
    res.render('index', {
        'title': 'Cache',
        'description': 'The cache was cleared',
        'year': 2016
    });
});

app.get('/getpartialsfrom', function(req, res) {
    var partials = renderer.getPartialsFrom(app.get('views'),
                                            app.get('view engine'));
    var a = [];
    for (name in partials) {
      a.push(`${name}: ${partials[name]}`);
    }
    res.send(a.join(', '));
});

app.listen(8081);