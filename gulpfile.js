'use strict';

/**
 * Created by Borja on 27/10/16.
 */
var  gulp = require('gulp'),
    runSequence = require('run-sequence'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    _ = require('lodash'),
    defaultAssets = require('./config/assets/default')


// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
    process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
    process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
    return plugins.nodemon({
        script: 'bin/www',
        nodeArgs: ['--debug'],
        ext: 'js,html',
        verbose: true,
        watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
    });
});

// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function () {
    return plugins.nodemon({
        script: 'pre-prod-env.js',
        ext: 'js,html',
        watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
    });
});

// Run the project in development mode
gulp.task('default', function (done) {
    runSequence('env:dev', 'nodemon', done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
    runSequence('env:prod', 'nodemon-nodebug', done);
});