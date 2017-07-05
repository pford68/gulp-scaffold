/**
 * Common Gulp tasks used at different development phases
 */

let gulp = require('gulp'),
    fs = require('fs'),
    jshint = require('gulp-jshint'),
    csslint = require('gulp-csslint'),
    merge = require("merge-stream"),            // Combines multiple streams into one.
    del = require('del'),
    sass = require('gulp-sass'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin'),
    imagemin = require('gulp-imagemin'),
    config = require("config"),
    gDestDir = './build';


/*
 Running SASS

 Compresses the resulting CSS file if not in debug mode
 */
gulp.task('sass', () => {
    // Omitting "sass" in src path below created an unwanted "sass" sub-directory.
    let dest = './build/css',
        src = './src/sass/main.scss';
    del.sync(dest);
    return gulp.src(src)
        .pipe(sass())
        .pipe(gulpif(config.debug === false, cssmin()))
        .pipe(gulp.dest(dest));
});



/*
 Linting
 */
gulp.task('lint', () => {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        // You can look into pretty reporters as well, but that's another story
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});


/*
 CSS Linting
 */
csslint.addFormatter('csslint-stylish');
gulp.task('css-lint', ['sass'], () => {
    return gulp.src('./build/**/*.css')
        .pipe(csslint('.csslintrc'))
        // You can look into pretty reporters as well, but that's another story
        .pipe(csslint.formatter('stylish'));
});



/*
 Images task:  copying images to the proper location
 */
gulp.task('images', () => {
    let dest = './build/images',
        src = './src/images/**/*';
    del.sync(dest);
    return gulp.src(src, { base: './src/images' })
        .pipe(imagemin()).pipe(gulp.dest(dest));
});

/*
 Copies angular templates to the build directory.
 */
gulp.task('views', () => {
    return gulp.src([
        './src/**/*.html',
        './src/**/*.css',
        './src/templates/*.html'
    ], { base: './src' })
        .pipe(gulp.dest(gDestDir));
});


