
// Gulp modules

var gulp        = require("gulp");
var vss         = require("vinyl-source-stream");
var gp          = require("gulp-load-plugins")();
var gulpif      = require('gulp-if');
var browserSync = require("browser-sync");
var args        = require("yargs").argv;
var gutil       = require("gutil");
var styl        = require("gulp-styl");
var sass        = require('gulp-ruby-sass');
var csso        = require('gulp-csso');
var imagemin    = require('gulp-imagemin');
var historyApiFallback = require("connect-history-api-fallback");
var uglify      = require('gulp-uglify');
var buffer      = require('vinyl-buffer');
var gettext     = require('gulp-angular-gettext');
var runSequence = require('run-sequence');
var bundler     = require("browserify")({
	cache: {},
	packageCache: {},
	ullPaths: true,
	entries: ["./src/modules/index.js"],
	extensions: [".js"],
	debug: true,
	transform: [require("browserify-shim"), require("browserify-ngannotate")]
});



// Vars
var envProd = false;
var reload = browserSync.reload;
var cssPaths = {
	plugins: ['./node_modules/ng-tags-input/build/ng-tags-input.min.css']
};



// Functions
var handleError = function(err) {
  console.log(err.message);
};

var bundle = function() {
    return bundler.bundle().on("error", function(err) {
        gutil.log(err.message);
        browserSync.notify("Browserify error");
    })

        .pipe(vss("bundle.js"))
        .pipe(gulpif(envProd, buffer() ))
        .pipe(gulpif(envProd, uglify({mangle: false}) ))
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.reload({stream: true, once: true}));
};



// --- Tasks ---

gulp.task('setProduction', function() {
    return envProd = true;
});

gulp.task('buildProd', function(callback) {
    runSequence('setProduction', ['buildDev'], callback);
});

gulp.task("buildDev", ["browserify", "sass", "images", "fonts", "templates", "index", "assets"]);

gulp.task("serve", ["watchify", "sass", "fonts", "assets", "index", "templates"], function(){
    browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [historyApiFallback()]
        }
    });
    gulp.watch("src/styles/*.sass", ["sass"]);
    gulp.watch("src/assets/images/**/*", ["images"]);
    gulp.watch("src/index.jade", ["index-watch"]);
    gulp.watch("src/modules/**/*.jade", ["templates-watch"]);
});

gulp.task('serveProd', function(callback) {
    runSequence('setProduction', ['serve'], callback);
});

// -- Default
gulp.task("default", ["buildDev"]);
gulp.task("build", ["buildDev"]);
//gulp.task("start", ["buildDev"]); // TODO: Server


// -- Helpers
gulp.task("browserify", function() {
    bundle();
});

gulp.task("sass", function() {
    sass("./src/styles/app.sass", {trace: true, sourcemap: true}).on("error", function(err) {
        gutil.log(err.message);
    })
        .pipe(styl())
        .pipe(csso())
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task("images", function() {
    gulp.src("src/assets/images/**")
        .pipe(gulpif(envProd, imagemin({
            progressive: true,
            optimizationLevel: 3,
            interlaced: true
        })))
        .pipe(gulp.dest("dist/assets/images"))
        .pipe(gp.size({title: "images"}));
});

gulp.task("fonts", function() {
    gulp.src(["src/assets/fonts/*", "bower_components/font-awesome/fonts/*"])
        .pipe(gulp.dest("dist/assets/fonts"))
        .pipe(gp.size({title: "fonts"}));
});

gulp.task("templates", function() {
    gulp.src("src/modules/**/*.jade")
        .pipe(gp.jade({pretty: true}).on("error", handleError))
        .pipe(gulpif(envProd, gp.minifyHtml({empty: true, spare: true, quotes: true})))
        .pipe(gp.angularTemplatecache({standalone: true}))
        .pipe(gp.header("module.exports = "))
        .pipe(gulp.dest("tmp"));
});

gulp.task("templates-watch", ["templates"], reload);

gulp.task("index", function() {
    gulp.src("src/index.jade")
        .pipe(gp.plumber())
        .pipe(gp.jade({pretty: false}))
        .pipe(gulp.dest("dist"));
});

gulp.task("assets", function() {
    gulp.src(["src/assets/**/*", "!src/assets/fonts", "!src/assets/images"])
        .pipe(gulp.dest("dist/assets"));
});

gulp.task("clean", function() {
    return gulp.src(["dist"], {read: false})
        .pipe(gp.rimraf({force: true}));
});

gulp.task("watchify", function() {
    var l_bundler = require("watchify")(bundler);
    l_bundler.on("update", bundle);
    bundle();
});


// -- Translate --

gulp.task("generateHtml", function(){
    return gulp.src("src/modules/**/*.jade")
        .pipe(gp.jade({pretty: true}).on("error", handleError))
        .pipe(gulp.dest("transtmp"));
});

gulp.task("pot", ['generateHtml'], function() {
    gulp.src(["transtmp/**/*.html"])
        .pipe(gettext.extract('template.pot', {

        }))
        .pipe(gulp.dest('po/'));
});

gulp.task("compileTranslation", function() {
    return gulp.src('po/**/*.po')
        .pipe(gettext.compile({
            // options to pass to angular-gettext-tools...
            format: 'json'
        }))
        .pipe(gulp.dest('dist/translations/'));
});




/*
gulp.task("importCss", function() {
	gulp.src(cssPaths.plugins).pipe(gp.importCss()).pipe(gulp.dest('dist/assets/css'))
});

gulp.task("browserifymin", function() {
    bundlemin();
});

gulp.task("watchify", function() {
	var l_bundler = require("watchify")(bundler);
	l_bundler.on("update", bundle);
	bundle();
});

gulp.task("usemin", ["index", "sass", "browserify"], function() {
    console.log("UseMin!");
    var options = {};
    console.log("Starting option");
  	//options.js = [gp.uglify(), gp.rev()];
    console.log("Options 1");
  	//options.css = [gp.csso(), gp.rev()];
    console.log("Options 2");
  	options.html = [gp.minifyHtml({empty: true, spare: true, comments: false, quotes: false})];
    console.log("Options 3");
    console.log("before dist");
    gulp.src("dist/index.html")
        .pipe(gp.usemin(options))
        .pipe(gulp.dest("dist"))
        .pipe(gp.size({title: "dist", showFiles: true, gzip: true}))
        .pipe(gp.size({title: "dist", showFiles: true, gzip: false}));
    console.log("after dist");
});
*/



/*gulp.task("index", function() {
  gulp.src("src/index.jade")
  .pipe(gp.plumber())
  .pipe(gp.jade({pretty: true}))
  .pipe(gulp.dest("dist"));
});*/

/*gulp.task("images", function() {
	gulp.src("src/assets/images/**")
	.pipe(gulp.dest("dist/assets/images"));
});

gulp.task("index-watch", ["index"], reload);

gulp.task("templates", function() {
	gulp.src("src/modules/**   /*.jade")
	.pipe(gp.jade({pretty: true}).on("error", handleError))
	.pipe(gp.if(args.production, gp.minifyHtml({empty: true, spare: true, quotes: true})))
	.pipe(gp.angularTemplatecache({standalone: true}))
	.pipe(gp.header("module.exports = "))
	.pipe(gulp.dest("tmp"));
});
gulp.task("templatesmin", function() {
	gulp.src("src/modules/**   /*.jade")
	.pipe(gp.jade({pretty: true}).on("error", handleError))
	.pipe(gp.minifyHtml({empty: true, spare: true, quotes: true}))
	.pipe(gp.angularTemplatecache({standalone: true}))
	.pipe(gp.header("module.exports = "))
	.pipe(gulp.dest("tmp"));
});*/

//gulp.task("templates-watch", ["templates"], reload);




/*gulp.task("build", ["browserify", "sass", "imagemin", "fonts", "templates", "index", "assets"]);
gulp.task("build-dev", ["browserify", "sass", "images", "fonts", "templates", "index", "assets"]);

gulp.task("build-min", ["browserifymin", "sass", "imagemin", "fonts", "templatesmin", "index", "assets"]);


*/
//gulp.task("default", ["build-dev"]);




