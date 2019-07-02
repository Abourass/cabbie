'use strict';

const debug = require('debug')('cabbie:server');
const http = require('http');
const ip = require('ip');
const chalk = require('chalk');
const app = require('../app.js');
debug.log = console.log.bind(console); // ===============================| Workaround for debug glitching in certain environments
const server = http.createServer(app); // ===============================| Create HTTP server

function normalizePort(val) { // ========================================| Normalize a port into a number, string, or false
  const port = parseInt(val, 10);
  if (typeof port !== 'number') { return val; }
  if (port >= 0) { return port; }
  return false;
}

const port = normalizePort(process.env.PORT || '5000'); // Get port from environment
app.set('port', port); // Store the port in Express

function onError(error) { // Event listener for HTTP server "error" event
  if (error.syscall !== 'listen') { throw error; }
  const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      debug(chalk.redBright(`${bind} requires elevated privileges`));
      break;
    case 'EADDRINUSE':
      debug(chalk.redBright(`${bind} is already in use`));
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(chalk.greenBright(`${process.env.NODE_ENV} run on http://${ip.address()}:${port} | You know what to do ♥`));
}

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
