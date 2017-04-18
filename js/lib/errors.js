var $ = require('jquery');

exports.show = function (message) {
    $('#error').text(message)
        .show();
};

exports.clear = function () {
    $('#error')
        .hide();
};

module.exports = exports;