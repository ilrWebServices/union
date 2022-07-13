const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require('gulp-concat');
const concat_css = require('gulp-concat-css');
const livereload = require("gulp-livereload");
const svgstore = require('gulp-svgstore');

var sass_config = {
  outputStyle: "nested"
};

function componentStyles() {
  return gulp
    .src('source/patterns/**/*.scss', { sourcemaps: true })
    .pipe(sass(sass_config)
      .on('error', sass.logError))
    .pipe(gulp.dest('source/_patterns/', { sourcemaps: '.' }));
}

function concatComponentStyles() {
  return gulp
    .src('source/patterns/**/*.scss', { sourcemaps: true })
    .pipe(sass(sass_config)
      .on('error', sass.logError))
    .pipe(concat_css('union.css', { rebaseUrls: false }))
    .pipe(gulp.dest('source/css/', { sourcemaps: '.' }));
}

function concatScripts() {
  return gulp
    .src('source/patterns/**/*.js', { sourcemaps: true })
    .pipe(concat('union.js'))
    .pipe(gulp.dest('source/js/', { sourcemaps: '.' }));
}

function concatSVGSprites() {
  return gulp
    .src('source/images/icons/*.svg')
    .pipe(svgstore())
    .pipe(gulp.dest('source/images/'));
}

function livereloadStartServer(done) {
  livereload.listen({ 'port': 35778 });
  done();
}

function watchFiles(done) {
  gulp.watch('source/patterns/**/*.scss', allStyles);
  gulp.watch('source/images/icons/*.svg', concatSVGSprites);
  gulp.watch('source/patterns/**/*.js', concatScripts);

  var lr_watcher = gulp.watch([
    'public/css/union.css',
    'public/js/union.js'
  ]);
  lr_watcher.on('change', livereload.changed);
  done();
}

const allStyles = gulp.parallel(componentStyles, concatComponentStyles);
const allTasks = gulp.parallel(allStyles, concatScripts, concatSVGSprites);
const watch = gulp.parallel(watchFiles, livereloadStartServer);

// Export gulp tasks.
exports.styles = allStyles;
exports.all = allTasks;
exports.default = watch;
