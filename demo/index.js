const server = require("server");
server.plugins.push(require("../index.js"));
const { get, error } = server.router;
const { render } = server.reply;

server(get("/", () => render("index.html")));
