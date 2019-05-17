const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require('gulp-concat');

var sass_config = {
  outputStyle: "nested"
};

function componentStyles() {
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

function watchFiles() {
  gulp.watch('source/patterns/**/*.scss', allStyles);
}

const allStyles = gulp.parallel(componentStyles, concatComponentStyles);

// Export gulp tasks.
exports.sass = allStyles
exports.default = watchFiles;
