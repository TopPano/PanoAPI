var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    changed    = require('gulp-changed');

var path = './js/',
    desPath = './build/';

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
        .pipe(concat('toppano.js'))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(gulp.dest('./build/'))
        .pipe(uglify())
        // .pipe(rename({ suffix: '.ugly' }))
        .pipe(gulp.dest(desPath));
});

// watch
gulp.task('watch', function() {
    gulp.watch(path + '*.js', ['script']);
});

gulp.task('default',['script', 'watch']);