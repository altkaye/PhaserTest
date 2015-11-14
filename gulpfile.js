var gulp = require("gulp");
var typescript = require("gulp-typescript");
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');

gulp.task("default", function () {
    gulp.src(["./src/**/*.ts"])
        .pipe(typescript({ target: "ES5", removeComments: true, sortOutput: true }))
        .js
        .pipe(concat("pr.js"))
        .pipe(gulp.dest("./build/"));
});

gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task("watch", function () {
    gulp.watch(["./src/**/*.ts"], ["default"]);
});

gulp.task("dev", ["webserver", "watch"]);

/**
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");

// TODO
gulp.task("concat", function() {
    gulp.src("js/*.js")
        .pipe(plumber())
        .pipe(concat("prpg.js"))
        .pipe(gulp.dest("build/"));
});

gulp.task("uglify", function() {
    gulp.src("build/prpg.js")
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({
            extname:".min.js"
        }))
        .pipe(gulp.dest("build/"));
});

gulp.task("default", ["concat", "uglify"]);

gulp.task("watch", function() {
    gulp.watch(["js/*.js"], ["concat"]);
    gulp.watch(["build/prpg.js"], ["uglify"]);
}); **/