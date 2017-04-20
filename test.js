var Server = require('karma').Server;

/**
 * Run tests once and exit
 */
new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
}).start();