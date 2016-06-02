const gulp = require('gulp');
const del = require('del');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const htmlreplace = require('gulp-html-replace');
const browserSync = require('browser-sync');
const history = require('connect-history-api-fallback');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const webpackConfigProd = require('./webpack.config.prod');

let bundler = webpack(webpackConfig);
let is_prod = false;

const paths = {
    dev: '.dev',
    index: './404.html'
};

const libs = {
    js: [
        'node_modules/oauthio-web/dist/oauth.js'
    ],
    css: [

    ]
};

const jslibs = {
    prod: {
        start: [
            'https://cdnjs.cloudflare.com/ajax/libs/oauth-io/0.5.2/oauth.min.js',
            'https://fb.me/react-15.1.0.min.js',
            'https://fb.me/react-dom-15.1.0.js'
        ],
        end: []
    },
    dev: {
        start: [
            'libs/js/oauth.js'
        ],
        end: []
    }
};

const csslibs = {
    prod: [],
    dev: []
};

function copytask(srcs, dest) {
    return function() {
        return gulp.src(srcs)
            .pipe(gulp.dest(dest));
    };
}

gulp.task('cleandev', function() {
    return del([paths.dev]);
});

gulp.task('copylibs', copytask(libs.js,
    paths.dev + '/libs/js'
));

gulp.task('html', () => {
    let dest = is_prod ? '.' : paths.dev;

    let env = is_prod ? 'prod' : 'dev';

    let startjs = jslibs[env].start;
    let endjs = jslibs[env].end;
    let css = csslibs[env];

    return gulp.src(paths.index)
        .pipe(htmlreplace({
            startjs: startjs,
            endjs: endjs,
            css: css
        }, {
            keepBlockTags: true
        }))
        .pipe(gulp.dest(dest));
});

gulp.task('devbuild', (cb) => {
    is_prod = false;
    gutil.log(gutil.colors.green('Building for development'));
    runSequence(
        'cleandev',
        'copylibs',
        'html',
        cb
    );
});

gulp.task('watch', ['devbuild'], () => {
    let spa = history({
        index: paths.index
    });
    browserSync({
        open: false,
        server: {
            baseDir: paths.dev,

            middleware: [
                webpackDevMiddleware(bundler, {
                    publicPath: webpackConfig.output.publicPath,
                    stats: { colors: true }
                }),
                webpackHotMiddleware(bundler),
                spa
            ]
        },
        files: [
        ]
    });
    gulp.watch(paths.index).on('change', browserSync.reload);
});

gulp.task('webpack:build', function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfigProd);

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        callback();
    });
});


gulp.task('default', ['watch']);

gulp.task('build', (cb) => {
    is_prod = true;
    gutil.log(gutil.colors.green('Building for production'));
    runSequence(
        'html',
        'webpack:build',
        cb
    );
});

