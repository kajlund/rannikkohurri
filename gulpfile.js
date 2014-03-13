var gulp = require('gulp'),
    mincss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    paths = {
        scripts: ['public/app/**/*.js'],
        css: 'public/css/style.css',
        vendor: 'public/vendor/**/*'
    },
    filesToDist = [
        'public/vendor/*min.js',
        'public/vendor/angular/*min**',
        'public/vendor/angular-cookies/*min**',
        'public/vendor/angular-route/*min**',
        'public/vendor/angular-touch/*min**',
        'public/vendor/jquery/*min**',
        'public/vendor/bootstrap/dist/js/*min**',
        'public/vendor/bootstrap/dist/css/*min**',
        'public/vendor/spinjs/spin**',
        'public/vendor/toastr/*min**',
        'public/vendor/font-awesome/css/*min**'
    ];

gulp.task('copydist', function () {
    // Copy files from vendor to lib folder
    gulp.src(filesToDist).pipe(gulp.dest('./public/lib'));
});

gulp.task('copyfonts', function () {
    // Copy fonts from vendor to fonts folder
    gulp.src('public/vendor/font-awesome/fonts/*').pipe(gulp.dest('./public/fonts'));
});

gulp.task('minifycss', function () {
    // Minify and copy style.css
    return gulp.src(paths.css)
        .pipe(mincss())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('concatjs', function () {
    // Concatenate app scripts to app-all.js
    return gulp.src(paths.scripts)
        .pipe(concat('app-all.js'))
        .pipe(gulp.dest('./public/'));
});

gulp.task('minifyjs', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(concat('app-all.min.js'))
        .pipe(gulp.dest('./public/'));
});

// Watch to rerun tasks when a file changes
gulp.task('watch', function () {
    gulp.watch(paths.vendor, ['copydist']);
    gulp.watch(paths.vendor, ['copyfonts']);
    gulp.watch(paths.css, ['minifycss']);
    gulp.watch(paths.scripts, ['concatjs']);
    gulp.watch(paths.scripts, ['minifyjs']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['copydist', 'copyfonts', 'minifycss', 'concatjs', 'minifyjs']);

