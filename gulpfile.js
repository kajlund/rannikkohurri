var atc        = require('gulp-angular-templatecache'),
    bump       = require('gulp-bump'),
    cache      = require('gulp-cache'),
    concat     = require('gulp-concat'),
    gulp       = require('gulp'),
    del        = require('del'),
    imagemin   = require('gulp-imagemin'),
    jshint     = require('gulp-jshint'),
    listing    = require('gulp-task-listing'),
    minifyCss  = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    nodemon    = require('gulp-nodemon'),
    pngquant   = require('imagemin-pngquant'),
    uglify     = require('gulp-uglify'),
    util       = require('gulp-util'),
    log        = util.log,
    pkg        = require('./package.json');

    //nodemon = require('gulp-nodemon'),
    //paths = {
    //    scripts: ['public/app/**/*.js'],
    //    css: 'public/css/style.css',
    //    vendor: 'public/vendor/**/*'
    //},
    filesToDist = [

    ];

/**
 * List the available gulp tasks
 */
gulp.task('help', listing);

/**
 * Bump the build version in package.json
 * @return {Stream}
 */
gulp.task('bump', function() {
    log('Bumping build version');
    return gulp.src('./package.json')
        .pipe(bump({type:'prerelease'}))
        .pipe(gulp.dest('./'));
});

/**
 * Lint the code
 * @return {Stream}
 */
gulp.task('analyze', function() {
    log('Analyzing source using JSHint');
    return gulp
        .src(pkg.paths.js)
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});


/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', function() {
    log('Compiling AngularJS $templateCache to ' + pkg.paths.stage + 'templates.js');

    return gulp
        .src(pkg.paths.htmltemplates)
        .pipe(atc('templates.js', {
            module: 'app',
            standalone: false,
            root: 'app/'
        }))
        .pipe(gulp.dest(pkg.paths.stage));
});

/**
 * Minify and bundle the app's JavaScript
 * @return {Stream}
 */
gulp.task('js', ['analyze', 'templatecache'], function () {
    log('Bundling, minifying, and copying the app\'s JavaScript');

    var source = [].concat(pkg.paths.js, pkg.paths.stage + 'templates.js');
    return gulp
        .src(source)
        // .pipe(plug.sourcemaps.init()) // get screwed up in the file rev process
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate({add: true, single_quotes: true}))
        //.pipe(plug.bytediff.start())
        .pipe(uglify({mangle: true}))
        //.pipe(plug.bytediff.stop(common.bytediffFormatter))
        // .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest('./public/'));
});

/**
 * Copy the Vendor JavaScript
 * @return {Stream}
 */
gulp.task('vendorjs', function () {
    log('Bundling, minifying, and copying the Vendor JavaScript');
    return gulp.src(pkg.paths.vendorjs)
        .pipe(concat('vendor.min.js'))
        //.pipe(plug.bytediff.start())
        //.pipe(uglify())
        //.pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest('./public')); // + 'vendor'));
});

/**
 * Minify and bundle the CSS
 * @return {Stream}
 */
gulp.task('css', function () {
    log('Bundling, minifying, and copying app CSS');
    return gulp.src(pkg.paths.css)
        .pipe(concat('app.min.css')) // Before bytediff or after
        //.pipe(plug.autoprefixer('last 2 version', '> 5%'))
        //.pipe(plug.bytediff.start())
        .pipe(minifyCss({}))
        //.pipe(plug.bytediff.stop(common.bytediffFormatter))
        //.pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(gulp.dest('./public/css'));
});

/**
 * Minify and bundle the Vendor CSS
 * @return {Stream}
 */
gulp.task('vendorcss', function () {
    log('Compressing, bundling, copying vendor CSS');
    return gulp.src(pkg.paths.vendorcss)
        .pipe(concat('vendor.min.css'))
        //.pipe(plug.bytediff.start())
        .pipe(minifyCss({}))
        //.pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest('./public/css'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', function () {
    log('Copying fonts');
    return gulp
        .src(pkg.paths.fonts)
        .pipe(gulp.dest('./public/fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', function () {
    log('Compressing images and copying to build/images');
    return gulp
        .src(pkg.paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(pkg.paths.build + 'images'));
});

/**
 * Copy files & Build
 * @return {Stream}
 */
gulp.task('build', ['fonts', 'images', 'js', 'vendorjs', 'css', 'vendorcss', 'bump'], function () {
    log('Building ' + pkg.name);
    return gulp
        .src(['./public/index.html','./public/favicon.ico','./package.json' ])
        .pipe(gulp.dest(pkg.paths.build));
});

/**
 * Run the Server
 */
gulp.task('server', function () {
    nodemon({ script: 'web.js', ext: 'html js', ignore: ['./test']})
        .on('change', ['analyze'])
        .on('restart', function () {
            console.log('*** Server restarted!');
        });
});

/**
 * Remove all files from the build folder
 * One way to run clean before all tasks is to run
 * from the cmd line: gulp clean && gulp stage
 * @return {Stream}
 */
gulp.task('clean', function (cb) {
    var paths = pkg.paths.build;
    log('Cleaning: ' + util.colors.blue(paths));
    del(paths, cb);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['server']);

