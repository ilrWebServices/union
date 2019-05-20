const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require('gulp-concat');
const livereload = require("gulp-livereload");

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

function livereloadStartServer(done) {
  livereload.listen({ 'port': 35778 });
  done();
}

function watchFiles(done) {
  gulp.watch('source/patterns/**/*.scss', allTasks);

  var lr_watcher = gulp.watch([
    'public/css/union.css'
  ]);
  lr_watcher.on('change', livereload.changed);
  done();
}

const allStyles = gulp.parallel(componentStyles, concatComponentStyles);
const allTasks = gulp.parallel(allStyles, concatScripts);
const watch = gulp.parallel(watchFiles, livereloadStartServer);

// Export gulp tasks.
exports.styles = allStyles;
exports.all = allTasks;
exports.default = watch;
