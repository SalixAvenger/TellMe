'use strict';

var browserify = require('browserify')
    , clean = require('gulp-clean')
    , connect = require('gulp-connect')
    , eslint = require('gulp-eslint')
    , gulp = require('gulp')
    , ngAnnotate = require('gulp-ng-annotate')
    , protractor = require('gulp-protractor').protractor
    , source = require('vinyl-source-stream')
    , streamify = require('gulp-streamify')
    , uglify = require('gulp-uglify');

/*
 * Useful tasks:
 * - gulp fast:
 *   - linting
 *   - unit tests
 *   - browserification
 *   - no minification, does not start server.
 * - gulp watch:
 *   - starts server with live reload enabled
 *   - lints, unit tests, browserifies and live-reloads changes in browser
 *   - no minification
 * - gulp:
 *   - linting
 *   - unit tests
 *   - browserification
 *   - minification and browserification of minified sources
 *   - start server for e2e tests
 *   - run Protractor End-to-end tests
 *   - stop server immediately when e2e tests have finished
 *
 * At development time, you should usually just have 'gulp watch' running in the
 * background all the time. Use 'gulp' before releases.
 */

var liveReload = true;

gulp.task('clean', function() {
  return gulp.src(['./app/ngAnnotate', './dist'], { read: false })
      .pipe(clean());
});

gulp.task('lint', function() {
  return gulp.src([
        'gulpfile.js',
        'app/js/**/*.js',
        '!app/js/third-party/**'
      ])
      .pipe(eslint())
      .pipe(eslint.format());
});


gulp.task('browserify', function() {
    gulp.src("./app/index.html")
        .pipe(gulp.dest("./dist/"));

    return browserify('./app/js/app.js', { debug: true })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(connect.reload());
});

gulp.task('ngAnnotate', ['lint'], function() {
  return gulp.src([
        'app/js/**/*.js',
        '!app/js/third-party/**'
      ])
      .pipe(ngAnnotate())
      .pipe(gulp.dest('./app/ngAnnotate'));
});

gulp.task('browserify-min', ['ngAnnotate'], function() {
  return browserify('./app/ngAnnotate/app.js')
      .bundle()
      .pipe(source('app.min.js'))
      .pipe(streamify(uglify({ mangle: false })))
      .pipe(gulp.dest('./dist/js/'));
});


gulp.task('server', ['browserify'], function() {
  connect.server({
    root: './dist/',
    livereload: liveReload
  });
});


gulp.task('watch', function() {
  gulp.start('server');
  gulp.watch([
    'app/js/**/*.js',
    '!app/js/third-party/**',
    'test/**/*.js'
  ], ['fast']);
});

gulp.task('fast', ['clean'], function() {
  gulp.start('browserify');
});

gulp.task('default', ['clean'], function() {
  liveReload = false;
  gulp.start('browserify', 'browserify-min');
});