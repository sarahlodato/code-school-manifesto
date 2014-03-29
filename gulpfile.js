// Special thanks to @chriskjaer for the handy little
// gulpfile.json and package.json that this was based off of:
// https://gist.github.com/chriskjaer/8634047

var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    sass        = require('gulp-sass'),
    csso        = require('gulp-csso'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    concat      = require('gulp-concat'),
    livereload  = require('gulp-livereload'),
    tinylr      = require('tiny-lr'),
    express     = require('express'),
    app         = express(),
    marked      = require('marked'),
    path        = require('path'),
    server      = tinylr(),
    deploy      = require("gulp-gh-pages");

gulp.task('css', function() {
  return gulp.src('css/main.scss')
    .pipe(
      sass({
        includePaths: ['css'],
        errLogToConsole: true
      }))
    .pipe(csso())
    .pipe(gulp.dest('dist/css/'))
    .pipe(livereload(server));
});

gulp.task('js-copy', function() {
  return gulp.src('js/*.js')
    .pipe(gulp.dest('dist/js/'))
    .pipe(livereload(server));
});

gulp.task('templates', function() {
  return gulp.src('templates/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(livereload(server));
});

gulp.task('express', function() {
  app.use(express.static(path.resolve('./dist')));
  app.listen(1337);
  gutil.log('Listening on port: 1337');
});

gulp.task('watch', function() {
  server.listen(35729, function(err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('css/*.*', ['css']);
    gulp.watch('js/*.js', ['js-copy']);
    gulp.watch(['templates/*.jade', 'README.md'], ['templates']);

  });
});

gulp.task('deploy', function() {
  gulp.src("dist/**/*")
    .pipe(deploy('git@github.com:masondesu/code-school-manifesto.git', 'origin'));
});

// Default Task
gulp.task('default', ['js-copy', 'css', 'templates', 'express', 'watch']);