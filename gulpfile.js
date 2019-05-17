const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");

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

// Export gulp tasks.
exports.sass = styles
