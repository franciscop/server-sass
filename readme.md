# @server/sass

A small plugin to automatically handle SASS and SCSS with [server.js](https://serverjs.io/). You request `/style.css` or `/style.min.css` and this plugin will make sure to either compile it on each request for dev, or once on launch for production.

> THIS IS WORKING BUT **EXPERIMENTAL** right now.

## Getting Started

First install the plugin:

```
npm install @server/sass
```

Then in your main `index.js` include it with server.js:

```js
const server = require("server");
const serverSass = require("@server/sass");

// TEMPORARY; this line will change
server.plugins.push(serverSass);

const { get } = server.router;
const { render } = server.reply;

// Render a single route for the homepage
server(get("/", () => render("index.html")));
```

Then let's create this file. This will be a simple HTML file inside `views/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sass Demo</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <h1>Hi there</h1>
    <div>Hello world!</div>
  </body>
</html>
```

The main important part here is the `/style.css`. This will be automatically compiled and generated from `@server/sass`. Finally, let's create some style on `style/style.scss`:

```scss
$background: red;

body {
  div {
    background: $background;
  }
}

ul li:nth-child(3) {
  background: $background;
}
```

Finally start the server with `node .` and try the project by opening `http://localhost:3000/`!

## Options

The only option available is the `source` of the SASS/SCSS, which can be specified as one of either:

```js
// With the default path:
server({ sass: "style/style.scss" });
server({ sass: { source: "style/style.scss" } });

// But it can be anything really:
server({ sass: "style.scss" });
server({ sass: "sass/style.sass" });
```

The extension can be either `.scss` or `.sass`, both will work properly.

The behaviour is a bit different for development and production, but from the front-end point of view you want to just request `/style.css` or `/style.min.css` (depending on your preferences).

## Demo

Clone this repo:

```js
git clone git@github.com:franciscop/server-sass.git
cd server-sass
```

Then install the dependencies, enter `demo` and start the project:

```bash
npm install
cd demo
node .
```

Finally open `http://localhost:3000/` to see the styles being rendered.
