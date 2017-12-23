const { get } = require('server/router');
const { type, send } = require('server/reply');
const sass = require('node-sass');
const path = require('path');
const fs = require('mz/fs');

// Async renderer
const asyncRender = opts => new Promise((resolve, reject) => sass.render(
  opts,
  (err, result) => err ? reject(err) : resolve('/* @server/sass */\n' + result.css.toString())
));

// Check whether a path is absolute or not
const absolute = value => path.isAbsolute(value);


// The text for the file already exists
const fileExists = name => `
There is already a file called ${name} that was not created by @server/sass.
Make sure to remove or rename this file, since @server/sass uses this file to put the
compiled CSS from the SASS/SCSS.
`;


module.exports = {
  name: 'sass',
  options: {
    url: { default: '/style.css' },
    source: {
      default: 'style/style.scss',
      clean: value => absolute(value)
        ? value : path.join(process.cwd(), value),
    },
    destination: {
      default: 'style.css',
      clean: (value, { parent }) => absolute(value)
        ? value : path.join(parent.public, value)
    },
    style: { default: 'compressed' }
  },


  // Write the file in the right place
  init: async ctx => {
    const destination = ctx.options.sass.destination;

    // Delete it (for both dev and prod)
    if (await fs.exists(destination)) {
      const existing = await fs.readFile(destination);
      if (/\/\* @server\/sass \*\//.test(existing) || /^\s*$/.test(existing)) {
        await fs.unlink(destination);
      } else {
        throw new Error(fileExists(destination));
      }
    }

    if (ctx.options.env === 'production') {
      const css = await asyncRender({
        file: ctx.options.sass.source,
        outputStyle: ctx.options.sass.style
      });
      await fs.writeFile(destination, css, 'utf8');
    }
  },


  before: async ctx => {

    // To check how long it takes
    const init = new Date();

    // When requesting the right path (e.g.: /style.css)
    return get(ctx.options.sass.url, async ctx => {
      // Create the css with the options
      const css = await asyncRender({
        file: ctx.options.sass.source,
        outputStyle: ctx.options.sass.style
      });

      // Debug how long it takes
      ctx.log.debug(`plugins:sass compiled in ${new Date() - init}ms`);

      // Send the css with the right type
      return type('text/css').send(css);
    })(ctx);
  }
};
