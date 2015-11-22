

/////////---------------

var gulp = require("gulp");
var vss = require("vinyl-source-stream");
var gp = require("gulp-load-plugins")();
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var args = require("yargs").argv;
var gutil = require("gutil");
var historyApiFallback = require("connect-history-api-fallback")
var bundler = require("browserify")({
    cache: {},
    packageCache: {},
    ullPaths: true,
    entries: ["./src/modules/index.js"],
    extensions: [".js"],
    debug: true,
    transform: [require("browserify-shim"), require("browserify-ngannotate")]
});
var cssPaths = {
    plugins: ['./node_modules/ng-tags-input/build/ng-tags-input.min.css']
};
var handleError = function(err) {
    console.log(err.message);
};

var sassStream = function() {
    var options = {trace: true, sourcemap: true};

    return gp.rubySass("./src/styles/app.sass", options).on("error", function(err) {
        gutil.log(err.message);
    });
};

var bundle = function() {
    return bundler.bundle().on("error", function(err) {
            gutil.log(err.message);
            browserSync.notify("Browserify error");
        })
        .pipe(vss("bundle.js"))
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.reload({stream: true, once: true}));
};

gulp.task("importCss", function() {
    gulp.src(cssPaths.plugins).pipe(gp.importCss()).pipe(gulp.dest('dist/assets/css'))
});

gulp.task("browserify", function() {
    bundle();
});

gulp.task("watchify", function() {
    var l_bundler = require("watchify")(bundler);
    l_bundler.on("update", bundle);
    bundle();
});

gulp.task("sass", function() {
    sassStream().pipe(gp.styl()).pipe(gulp.dest("dist")).pipe(browserSync.reload({stream: true}));
});

gulp.task("usemin", ["index", "sass", "browserify"], function() {
    options = {};
    if(args.production){
        options.js = [gp.uglify(), gp.rev()];
        options.css = [gp.csso(), gp.rev()];
        options.html = [gp.minifyHtml({empty: true, spare: true, comments: false, quotes: false})];
    }else{
        options.js = [];
        options.css = [];
        options.html = [];
    };
    gulp.src("dist/index.html")
        .pipe(gp.usemin(options))
        .pipe(gulp.dest("dist"))
        .pipe(gp.size({title: "dist", showFiles: true, gzip: true}))
        .pipe(gp.size({title: "dist", showFiles: true, gzip: false}));
});

gulp.task("fonts", function() {
    gulp.src(["src/assets/fonts/*", "bower_components/font-awesome/fonts/*"])
        .pipe(gulp.dest("dist/assets/fonts"))
        .pipe(gp.size({title: "fonts"}));
});

gulp.task("imagemin", function() {
    gulp.src("src/assets/images/**")
        .pipe(gp.imagemin({
            progressive: true,
            optimizationLevel: 3,
            interlaced: true
        }))
        .pipe(gulp.dest("dist/assets/images"))
        .pipe(gp.size({title: "images"}));
});

gulp.task("index", function() {
    gulp.src("src/index.jade")
        .pipe(gp.plumber())
        .pipe(gp.jade({pretty: true}))
        .pipe(gulp.dest("dist"));
});

gulp.task("images", function() {
    gulp.src("src/assets/images/**")
        .pipe(gulp.dest("dist/assets/images"));
});

gulp.task("index-watch", ["index"], reload);

gulp.task("templates", function() {
    gulp.src("src/modules/**/*.jade")
        .pipe(gp.jade({pretty: true}).on("error", handleError))
        .pipe(gp.if(args.production, gp.minifyHtml({empty: true, spare: true, quotes: true})))
        .pipe(gp.angularTemplatecache({standalone: true}))
        .pipe(gp.header("module.exports = "))
        .pipe(gulp.dest("tmp"));
});

gulp.task("templates-watch", ["templates"], reload);

gulp.task("serve", ["watchify", "sass", "fonts", "assets", "index", "templates", "importCss"], function(){
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

gulp.task("assets", function() {
    gulp.src(["src/assets/**/*", "!src/assets/fonts", "!src/assets/images"])
        .pipe(gulp.dest("dist/assets"));
});

gulp.task("build", ["browserify", "sass", "imagemin", "fonts", "templates", "index", "assets"]);
gulp.task("build-dev", ["browserify", "sass", "images", "fonts", "templates", "index", "assets"]);
gulp.task("clean", function() {
    gulp.src(["dist"], {read: false})
        .pipe(gp.rimraf({force: true}));
});

gulp.task("default", ["build-dev"]);
