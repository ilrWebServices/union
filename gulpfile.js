const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require('gulp-concat');

var sass_config = {
  outputStyle: "nested"
};

function styles() {
  return gulp
    .src('source/patterns/**/*.scss', { sourcemaps: true })
    .pipe(sass(sass_config)
      .on('error', sass.logError))
    .pipe(gulp.dest('source/patterns/', { sourcemaps: '.' }));
}

function concatComponentStyles() {
  return gulp
    .src('source/patterns/**/*.scss', { sourcemaps: true })
    .pipe(sass(sass_config)
      .on('error', sass.logError))
    .pipe(concat('union.css'))
    .pipe(gulp.dest('source/css/', { sourcemaps: '.' }));
}

// Export gulp tasks.
exports.sass = styles
exports.concatcss = concatComponentStyles
