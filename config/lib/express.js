'use strict';

var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    config = require('../config');


/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(require('node-sass-middleware')({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        indentedSyntax: true,
        sourceMap: true
    }));
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
    app.set('views', path.resolve('./'));
    app.set('view engine', 'pug');
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
    config.files.server.configs.forEach(function (configPath) {
        require(path.resolve(configPath))(app, db);
    });
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
    // Setting the app router and static folder
    app.use('/', express.static(path.resolve('./public'), { maxAge: 86400000 }));

    // Globbing static routing
    //config.folders.client.forEach(function (staticPath) {
    //    app.use(staticPath, express.static(path.resolve('./' + staticPath)));
    //});
};


/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
    // Globbing routing files
    config.files.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) {
            return next();
        }

        // Log it
        console.error(err.stack);

        // Redirect to error page
        res.redirect('/server-error');
    });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
    // Initialize express app
    var app = express();

    // Initialize local variables
    //this.initLocalVariables(app)

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize Helmet security headers
    //this.initHelmetHeaders(app);

    // Initialize modules static client routes, before session!
    this.initModulesClientRoutes(app);

    // Initialize Express session
    //this.initSession(app, db);

    // Initialize Modules configuration
    this.initModulesConfiguration(app);

    // Initialize modules server authorization policies
    //this.initModulesServerPolicies(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    // Initialize error routes
    this.initErrorRoutes(app);

    // Configure Socket.io
    //app = this.configureSocketIO(app, db);

    return app;
};