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

function concatScripts() {
  return gulp
    .src('source/patterns/**/*.js', { sourcemaps: true })
    .pipe(concat('union.js'))
    .pipe(gulp.dest('source/js/', { sourcemaps: '.' }));
}

function watchFiles() {
  gulp.watch('source/patterns/**/*.scss', allTasks);
}

const allStyles = gulp.parallel(componentStyles, concatComponentStyles);
const allTasks = gulp.parallel(allStyles, concatScripts);

// Export gulp tasks.
exports.styles = allStyles;
exports.all = allTasks;
exports.default = watchFiles;
