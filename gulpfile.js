'use strict';

var browserify = require('browserify')
    , clean = require('gulp-clean')
    , connect = require('gulp-connect')
    , eslint = require('gulp-eslint')
    , gulp = require('gulp')
    , ngAnnotate = require('gulp-ng-annotate')
    , protractor = require('gulp-protractor').protractor
    , source = require('vinyl-source-stream')
    , buffer = require('vinyl-buffer')
    , streamify = require('gulp-streamify')
    , uglify = require('gulp-uglify')
    , templateCache = require('gulp-angular-templatecache')
    , concat = require('gulp-concat')
    , addStream = require('add-stream')
    , ngHtml2Js = require('browserify-ng-html2js')
    , eventStream = require('event-stream')
    , streamqueue = require('streamqueue')
    , browserSync = require("browser-sync")
    , jade = require('gulp-jade')
    , concatCss = require('gulp-concat-css')
    , header = require('gulp-header');



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



/*gulp.task('browserify', function() {
    gulp.src("./app/index.html")
        .pipe(gulp.dest("./dist/"));

    return browserify('./app/js/app.js', { debug: true })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(connect.reload());
});*/


/* FUNKAR
gulp.task('browserify', function () {
    gulp.src("./app/index.html")
        .pipe(gulp.dest("./dist/"));

    //var bs = browserify('./app/js/app.js', { debug: true }).bundle().pipe(source('bundle.js'));
    var bs = browserify('./app/js/app.js', { debug: true }).bundle().pipe(source('app.js')).pipe(buffer());
    //bs = gulp.src('./app/js/app.js');
    var hs = gulp.src('./app/views/*.html').pipe(templateCache());

    return eventStream.merge(bs, hs)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/js'));
});*/

gulp.task('browserify', function () {


    // Templates
    gulp.src('./app/views/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(templateCache({standalone: true}))
        .pipe(header("module.exports = "))
        .pipe(gulp.dest("tmp"));

    // CSS
    gulp.src('./app/css/*.css')
        .pipe(concatCss("css/styles.css"))
        .pipe(gulp.dest('./dist/'));


    // Index
    gulp.src("./app/index.jade")
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest("./dist/"));


    // Browserify'd script
    var bs = browserify('./app/js/app.js', { debug: true }).bundle().pipe(source('bs.js')).pipe(buffer());
    // Template files to script
    /*var ts = gulp.src('./app/views/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(templateCache({standalone: true}))
        .pipe(header("module.exports = "));*/
    // Bootstrap
    var ss = gulp.src('./app/js/bootstrap.min.js');
    // jQuery
    var js = gulp.src('./app/js/jquery-1.11.3.min.js');

    return streamqueue({ objectMode: true }, bs/*, ts, js, ss*/)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./dist/js'));
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
  /*connect.server({
    root: './dist/',
    livereload: liveReload
  });*/
    browserSync.init({
        server: {
            baseDir: "./dist"/*,
            middleware: [historyApiFallback()]*/
        }
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


