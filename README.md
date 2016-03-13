# hogan-cached
[Express.js](http://expressjs.com/) view engine that renders [Mustache](http://mustache.github.io/) with [Hogan.js](http://twitter.github.io/hogan.js/) and caches compiled templates for more speed

[![NPM](https://nodei.co/npm/hogan-cached.png)](https://nodei.co/npm/hogan-cached/)

* Cache: Compiles once. Renders faster.
* Partials support
* Lambda support
* All of [mustache(5)](http://mustache.github.io/mustache.5.html) features

## Examples
```javascript
var express = require('express');
var app = express();

app.engine('html', require('hogan-cached'));
app.set('view engine', 'html');

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Hello World!'
    });
});

app.listen(80);
```

#### Partials

```javascript
// Register globally
app.set('partials', {header: 'path/to/header'});

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Hello World!',
        
        // Register only for this render
        partials: {
            content: 'path/to/content'
        }
    });
});
```

```html
{{> header}}
<div id="content">
    {{> content}}
</div>
```

#### Lambda

```javascript
app.get('/', function(req, res) {
    res.render('lambda', {
        // Use a function
        center: function() {
            return function(text) {
                return '<div style="text-align: center;">' + text + '</div>';
            };
        },
        // Or just a condition
        logged_in: false
    });
});
```

```html
{{#center}}
I'm centered!
{{/center}}

{{#logged_in}}
<strong>You are logged in!</strong>
{{/logged_in}}
```

#### Cache
You can clear the cache anytime with `clearCache`
```javascript
var engine = require('hogan-cached');

app.engine('html', engine);
app.set('view engine', 'html');

// ...

engine.clearCache();
```

You can also disable the cache for dev environment
```javascript
app.set('hogan cache', false);
```

#### More examples?
Check out [test/test.js](https://github.com/Guichaguri/hogan-cached/blob/master/test/test.js)