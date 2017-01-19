/**
 * Tasks related to Browserify.  Adds watchify to watch for changes
 */

let gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require("browserify"),
    gulpif = require('gulp-if'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify'),
    config = require('./config/browserify.cfg'),
    bundler;


function bundle() {
    let entryPoint = './src/ts/main.ts';
    return bundler.bundle()
        .pipe(source(entryPoint))
        .pipe(gulpif(config.debug === false, streamify(uglify())))
        .pipe(rename("main.js"))
        .pipe(gulp.dest('./build/js'));
}

bundler = browserify(config.browserify)
    .plugin(tsify, config.tsify)
    .transform('babelify', config.babelify)
    .on('update', bundle)          // Absolutely necessary for the server to reload, and probably to re-bundle
    .on('error', (err) => {
        gutil.log(`Browserify error: ${err.message}`);
        // end this stream
        this.emit('end');
    });




//========================================================= Tasks
/*
 Browserify task.

 Fetches dependencies, and compresses the resulting JS bundle if not in debug mode.
 */
gulp.task("browserify", bundle);