const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const concat = require('gulp-concat');

var sass_config = {
  outputStyle: "nested"
};

function styles() {
  return gulp
    .src('source/patterns/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sass_config)
      .on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('source/patterns/'));
}

function concatComponentStyles() {
  return gulp
    .src('source/patterns/**/*.css')
    .pipe(concat('union.css'))
    .pipe(gulp.dest('source/css/'));
}

// Export gulp tasks.
exports.sass = styles
exports.concatcss = concatComponentStyles
