'use strict';

var validator = require('validator'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
    var safeUserObject = null;
    if (req.user) {

    }

    res.render('modules/core/server/views/index', {
        user: JSON.stringify(safeUserObject)
    });
}