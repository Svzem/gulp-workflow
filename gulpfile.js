
var gulp = require("gulp"),
    gutil = require("gulp-util"),
    coffee = require("gulp-coffee"),
    browserify = require("gulp-browserify"),
    compass = require("gulp-compass"),
    connect = require("gulp-connect"),
    concat = require("gulp-concat");
    ifElse = require("gulp-if-else");
    gulpIf = require("gulp-if");
    uglify = require("gulp-uglify");
    minifyHTML = require("gulp-minify-html");
    jsonminify = require("gulp-jsonminify");

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

//to change to production execute "NODE_ENV=production gulp"

    env = process.env.NODE_ENV || "development";

if (env === "development") {

    outputDir = "builds/development/";
    sassStyle = "expanded";

} else {

    outputDir = "builds/production/";
    sassStyle = "compressed";

}

coffeeSources = ["components/coffee/tagline.coffee"];
jsSources = ["components/scripts/rclick.js", "components/scripts/pixgrid.js",
            "components/scripts/tagline.js", "components/scripts/template.js"];
sassSources = ["components/sass/style.scss"];
htmlSources = [outputDir + "/*.html"];
jsonSources = [outputDir + "/js/*.json"];

gulp.task("coffee", function() {

    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
        .on("error", gutil.log))
        .pipe(gulp.dest("components/scripts"));

});

gulp.task("concat", function() {

    gulp.src(jsSources)
        .pipe(concat("script.js"))
        .pipe(browserify())
        .pipe(gulpIf(env === "production",uglify()))
        .pipe(gulp.dest(outputDir + "/js"))
        .pipe(connect.reload());

});

gulp.task("compass", function () {

    gulp.src(sassSources)
        .pipe(compass({

            style: sassStyle,
            sass: "components/sass",
            image: outputDir + "/images"
            
        }))
        .on("error", gutil.log)
        .pipe(gulp.dest(outputDir + "/css"))
        .pipe(connect.reload());

});

gulp.task("connect",function() {

    connect.server({

        root: outputDir,
        livereload : true

    });

});

gulp.task("html",function() {
    
    gulp.src("builds/development/*.html")
    .pipe(gulpIf(env === "production", minifyHTML()))
    .pipe(gulpIf(env === "production", gulp.dest(outputDir)))
    .pipe(connect.reload());

});

gulp.task("json", function () {

    gulp.src("builds/development/js/*.json")
    .pipe(gulpIf(env === "production", jsonminify()))
    .pipe(gulpIf(env === "production", gulp.dest("builds/production/js")))
    .pipe(connect.reload());

});

gulp.task("watch", function() {

    gulp.watch(coffeeSources, ["coffee"]);
    gulp.watch(jsSources, ["concat"]);
    gulp.watch("components/sass/*.scss", ["compass"]);
    gulp.watch("builds/development/*.html", ["html"]);
    gulp.watch("builds/development/js/*.json", ["json"]);

});

gulp.task("all", ["coffee", "concat", "compass"]);
gulp.task("default", ["html","json","coffee", "concat", "compass","connect","watch"]);