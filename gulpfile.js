const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

const files = {
  sassPath: 'src/sass/*.sass',
  cssPath: 'dist/css/*.css',
  cssMinifiedPath: 'dist/css/minified',
  htmlPath: 'dist/*.html',
  jsspath: 'src/js/*.js',
  imagePath: 'src/images/image1.jpg'
}

function jsTask() {
  return src(files.jsspath)
    .pipe(uglify())
    .pipe(dest('dist/js/'));
}

function imageTask() {
  return src(files.imagePath)
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}

function compileSASS() {
  console.log('compileSASS');
  return src(files.sassPath)
  .pipe(sass().on('error', sass.logError))
  .pipe(dest('dist/css'));
}

function minifyCSS() {
  console.log('minifyCSS')
  return src(files.cssPath)
    .pipe(uglifycss({
      "uglyComments": true
    }))
  .pipe(dest('dist/minified'));
}

function watchTask() {
  watch(
    [files.sassPath, files.cssMinifiedPath, files.htmlPath, files.jsspath, files.imagePath],
    series(compileSASS, minifyCSS, jsTask, reloadTask)
  )
  console.log('watchTask')
}

function serveTask(d) {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });
  console.log('serveTask');
  d();
}

function reloadTask(d) {
  browserSync.reload();
  d();
}

exports.default = series(compileSASS, minifyCSS, jsTask, imageTask, serveTask, watchTask)


// exports.sass = compileSASS;
// exports.css = minifyCSS;


// exports.default = series(scssTask, serveTask, watchTask);

// gulp.task('run', ['sass', 'css']);

// gulp.task('watch', function() {
//   gulp.watch('./src/sass/*.sass', ['sass']);
//   gulp.watch('./dist/css/*.css', ['css']);
// });

// gulp.task('default', ['run', 'watch']);