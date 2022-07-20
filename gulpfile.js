const gulp = require("gulp");
const sass = require("gulp-sass");
const livereload = require("gulp-livereload");
const svgstore = require('gulp-svgstore');

var sass_config = {
  outputStyle: "nested"
};

function componentStyles() {
  return gulp
    .src('components/**/*.scss', { sourcemaps: true })
    .pipe(sass(sass_config)
      .on('error', sass.logError))
    .pipe(gulp.dest('components/', { sourcemaps: '.' }));
}

function concatSVGSprites() {
  return gulp
    .src('images/icons/*.svg')
    .pipe(svgstore())
    .pipe(gulp.dest('images/'));
}

function livereloadStartServer(done) {
  livereload.listen({ 'port': 35778 });
  done();
}

function watchFiles(done) {
  gulp.watch('components/**/*.scss', allStyles);
  gulp.watch('images/icons/*.svg', concatSVGSprites);

  var lr_watcher = gulp.watch([
    'components/**/*.css',
    'components/**/*.js'
  ]);
  lr_watcher.on('change', livereload.changed);
  done();
}

const allStyles = gulp.parallel(componentStyles);
const allTasks = gulp.parallel(allStyles, concatSVGSprites);
const watch = gulp.parallel(watchFiles, livereloadStartServer);

// Export gulp tasks.
exports.styles = allStyles;
exports.all = allTasks;
exports.default = watch;
