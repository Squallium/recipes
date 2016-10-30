'use strict';

var config = require('../config'),
    express = require('./express'),
    debug = require('debug')('recipes:server'),
    http = require('http');

module.exports.init = function init(callback) {
    var db = null;
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config)
};

module.exports.start = function start(callback) {
    var _this = this;

    _this.init(function (app, db, config) {
        /**
         * Get port from environment and store in Express.
         */

        var port = normalizePort(process.env.PORT || '3000');
        app.set('port', port);

        /**
         * Create HTTP server.
         */

        var server = http.createServer(app);

        /**
         * Listen on provided port, on all network interfaces.
         */

        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);

        /**
         * Normalize a port into a number, string, or false.
         */

        function normalizePort(val) {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                return port;
            }

            return false;
        }

        /**
         * Event listener for HTTP server "error" event.
         */

        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        /**
         * Event listener for HTTP server "listening" event.
         */

        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);

            if (callback) callback(app, db, config);
        }
    });
};