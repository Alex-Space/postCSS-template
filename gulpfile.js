"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var nestedcss = require('postcss-nested');
var simplevars = require('postcss-simple-vars');
var sprite = require('css-sprite').stream;
var gulpif = require('gulp-if');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

// CSS
gulp.task('css', function () {
    var processors = [
        autoprefixer({ browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'], cascade: false, remove: false }),
        mqpacker,
        csswring,
        nestedcss,
        simplevars
    ];
    return gulp.src('css/postcss/*.css')
        .pipe(postcss(processors))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('css'));
});


// JS
gulp.task('scripts', function() {
    return gulp.src('js/stack/*.js')
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js/'));
});

// generate sprite.png and sprite.css
gulp.task('sprite', function () {
  return gulp.src('img/sprite/*.png')
    .pipe(sprite({
      name: 'sprite',
      style: 'sprite.css',
      cssPath: 'css/postcss',
      processor: 'css',
      margin: 4,
      image: 'img/sprite.png'
    }))
    .pipe(gulpif('*.png', gulp.dest('img/'), gulp.dest('css/postcss')));
});

// watch
gulp.task('watch', function() {
    gulp.watch('css/postcss/*.css', ['css']);
	gulp.watch('js/*.js', ['scripts']);
});

// default
gulp.task('default', ['sprite', 'css', 'scripts', 'watch']);
