var gulp = require('gulp'),
    mincss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    size = require('gulp-size'),
    nodemon = require('gulp-nodemon'),
    paths = {
        scripts: ['public/app/**/*.js'],
        css: 'public/css/style.css',
        vendor: 'public/vendor/**/*'
    },
    filesToDist = [
        'public/vendor/modernizr/modernizr.js',
        'public/vendor/respond/dest/respond.min.js',
        'public/vendor/underscore/underscore.js',
        'public/vendor/angular/angular.min.js',
        'public/vendor/angular/angular.min.js.map',
        'public/vendor/angular-animate/angular-animate.min.js',
        'public/vendor/angular-animate/angular-animate.min.js.map',
        'public/vendor/angular-cookies/angular-cookies.min.js',
        'public/vendor/angular-cookies/angular-cookies.min.js.map',
        'public/vendor/angular-sanitize/angular-sanitize.min.js',
        'public/vendor/angular-sanitize/angular-sanitize.min.js.map',
        'public/vendor/angular-ui-router/release/angular-ui-router.min.js',
        'public/vendor/angular-touch/angular-touch.min.js',
        'public/vendor/jquery/jquery.min.js',
        'public/vendor/jquery/jquery.min.map',
        'public/vendor/bootstrap/dist/js/bootstrap.min.js',
        'public/vendor/bootstrap/dist/css/bootstrap.min.css',
        'public/vendor/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/vendor/toastr/toastr.min.js',
        'public/vendor/toastr/toastr.min.js.map',
        'public/vendor/toastr/toastr.css',
        'public/vendor/font-awesome/css/font-awesome.min.css',
        'public/vendor/moment/min/moment.min.js',
        'public/vendor/angular-loading-bar/build/loading-bar.min.css',
        'public/vendor/angular-loading-bar/build/loading-bar.min.js',
        'public/vendor/angular-strap/dist/angular-strap.min.js',
        'public/vendor/angular-strap/dist/angular-strap.tpl.min.js',
        'public/vendor/angular-motion/dist/angular-motion.min.css',
        'public/vendor/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
        'public/vendor/ng-grid/build/ng-grid.min.js',
        'public/vendor/ng-grid/ng-grid.min.css'
    ];

gulp.task('copydist', function () {
    // Copy files from vendor to lib folder
    gulp.src(filesToDist).pipe(gulp.dest('./public/lib'));
});

gulp.task('copyfonts', function () {
    // Copy fonts from vendor to fonts folder
    gulp.src('public/vendor/font-awesome/fonts/*').pipe(gulp.dest('./public/fonts'));
    gulp.src('public/vendor/bootstrap/dist/fonts/*').pipe(gulp.dest('./public/fonts'));
});

gulp.task('minifycss', function () {
    // Minify and copy style.css
    return gulp.src(paths.css)
        .pipe(mincss())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('buildjsconcat', function () {
    // Concatenate app scripts to app-all.js
    return gulp.src(paths.scripts)
        .pipe(concat('app-all.js'))
        .pipe(size())
        .pipe(gulp.dest('./public/'));
});

gulp.task('buildjsmin', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
        .pipe(concat('app-all.min.js'))
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('./public/'));
});

gulp.task('buildjs', function () {
    // concat and minify app scripts
    return gulp.src(paths.scripts)
        .pipe(concat('app-all.js'))
        .pipe(gulp.dest('./public/'))
        .pipe(rename('app-all.min.js'))
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('./public/'));
});

gulp.task('lint', function () {
    gulp.src(scripts).pipe(jshint());
});

gulp.task('develop', function () {
    nodemon({ script: 'web.js', ext: 'html js', ignore: []})
    .on('change', ['lint'])
    .on('restart', function () {
        console.log('*** Server restarted!');
    });
});

// Watch to rerun tasks when a file changes
gulp.task('watch', function () {
    gulp.watch(paths.vendor, ['copydist']);
    gulp.watch(paths.vendor, ['copyfonts']);
    gulp.watch(paths.css, ['minifycss']);
    gulp.watch(paths.scripts, ['buildjs']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['copydist', 'copyfonts', 'minifycss', 'buildjs']);

