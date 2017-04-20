var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    minify = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    webpack = require('webpack'),
    uglify = require('gulp-uglify'),
    webpackStream = require('webpack-stream');

/**
 * compile all less files in the /less/compile directory into css and minified css
 */
gulp.task('less', function () {
    return gulp.src(['./less/compile/*.less'])
        .pipe(less({
            paths: [path.join(__dirname, 'less')]
        }))
        .pipe(gulp.dest('./css'))
        .pipe(minify({compatibility: 'ie8'}))
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch-less', function () {
    watch('**/*.less', batch(function (events, done) {
        gulp.start('less', done);
    }));
});

/**
 * compile and minify the front-end js
 */
gulp.task('watch-bundle', function () {
    return gulp.src('./js/entry.js')
        .pipe(webpackStream({
            output: {
                filename: 'bundle.js'
            },
            watch: true
        }, webpack))
        .pipe(gulp.dest('./js/'))
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest('./js/'));
});