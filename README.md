# SASS & SCSS for server.js

A small plugin to handle SASS and SCSS.

> THIS IS **EXPERIMENTAL** right now.

## Install

```
npm install @server/sass
```

Then in your main `index.js`:

```js
const server = require('server');

// TEMPORARY; this line will change
server.plugins.push(require('@server/sass'));

const { get } = server.router;
const { render } = server.reply;

// Render a single route for the homepage
server(get('/', () => render('index.html')));
```

Then let's create this file. This will be a simple HTML file inside `views/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sass Demo</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Hi there</h1>
  <div>Hello world!</div>
  <ul>
    <li>Hi</li>
    <li>There</li>
    <li>What's</li>
    <li>Up?</li>
  </ul>
</body>
</html>
```

The main important part here is the `/style.css`. This will be automatically compiled and generated from `@server/sass`. Finally, let's create some style.

By default our entry point has to be on `style/style.scss`:



## Options

The entry point (source) is by default on `style/style.scss`, but this can be changed:

```js
server({ sass: { source: 'sass/style.sass' } });
```

Our destination file is by default in `style.css` inside the public folder. This can be changed several ways:

```js
// Define a different public folder
server({ public: 'wherever' });
// => wherever/style.css

// Define a different destination file. NOTE: see next section
server({ sass: { destination: 'compiled.min.css' } });
// => public/compiled.min.css

// Change both of them. NOTE: see next section
server({ public: 'wherever', sass: { destination: 'compiled.min.css' } });
// => wherever/compiled.min.css

// Define an absolute path. NOTE: see next section
server({ sass: { destination: __dirname + '/style.css' } });
```

Note that the destination path needs to be publicly accessible for our code to be production ready.


If you change the destination, you'll also need to change the url to match that of the public folder:

```js
// Default
server();
// destination => public/style.css
// url => /style.css

// Changing the destination needs to have
server({ sass: { destination: 'compiled.min.css', url: '/compiled.min.css' } });
// destination => public/compiled.min.css
// url => /compiled.min.css

// WRONG
server({ sass: { destination: 'compiled.min.css' } });
// destination => public/compiled.min.css
// url => /style.css (DOES NOT MATCH)
```
