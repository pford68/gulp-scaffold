/**
 * Gulp tasks specific to development:
 * (1) Running a dev server
 * (2) Running tests.
 *
 *
 *   NOTES:
 *   (1) The livereload module works best with Chrome's Livereload extension:
 *       See https://www.npmjs.org/package/gulp-livereload
 */

let gulp = require('gulp'),
    karma = require('karma'),
    path = require('path');

require("./common");
require("./browserify");


/**
 * Run test once and exit
 */
gulp.task('test', done => {
    new karma.Server({
        configFile: path.resolve('./karma.conf.js'),  // karma was not finding ../karma.conf.js
        singleRun: true
    }, done).start();
});
