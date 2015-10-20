var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    plumber    = require('gulp-plumber'),
    complexity = require('gulp-complexity'),
    changed    = require('gulp-changed');

// var path = './js/',
//     desPath = './build/';

var path = '/Users/ike/PanoAPI/node/public/js/',
    // desPath = '/Users/ike/PanoAPI/node/public/javascripts/';
    desPath = '/Users/ike/PanoAPI/sdk-test/js';

// process js scripts
gulp.task('script', function() {
    console.log('processing scripts...');
    return gulp.src([path + 'three.min.js',
                     path + 'detect.min.js',
                     path + 'CanvasRenderer.js',
                     path + 'Projector.js',
                     path + 'stats.js',
                     path + 'pano.api.js',
                     path + 'class.js',
                     path + 'pano.func.js',
                     path + 'View.js',
                     path + 'listener.js'])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('toppano.js'))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(gulp.dest('./build/'))
        // .pipe(complexity())
        // .pipe(rename({ suffix: '.ugly' }))
        .pipe(gulp.dest(desPath));
});

// watch
gulp.task('watch', function() {
    gulp.watch(path + '*.js', ['script']);
});

gulp.task('default',['script', 'watch']);