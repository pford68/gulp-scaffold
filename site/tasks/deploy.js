/**
 *  Gulp tasks related to deployment and distribution
 */

var gulp = require('gulp');
var zip = require('gulp-zip');
var rev = require('gulp-rev');  // For appending timestamps to filenames
var project = require('../project.json');

var dist = [
    'build/*',
    '*.json',
    'config/*',
    'server.js'
];

gulp.task('zip', function () {
    return gulp.src(dist, { base: "." })
        .pipe(zip(project.name + ".zip"))
        .pipe(rev())
        .pipe(gulp.dest('dist'));
});
