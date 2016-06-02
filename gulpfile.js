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

let bundler = webpack(webpackConfig);
let is_prod = false;

const paths = {
    dev: '.dev',
    index: './404.html'
};

const libs = {
    js: [
        'node_modules/react/dist/react.js'
    ],
    css: [

    ]
};

const jslibs = {
    prod: {
        start: [],
        end: []
    },
    dev: {
        start: [
            'libs/js/react.js'
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
    let dest = paths.dev;

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
            'src/css/*.css',
            paths.index
        ]
    });
});

gulp.task('default', ['watch']);

gulp.task('build', (cb) => {
    is_prod = true;
    gutil.log(gutil.colors.green('Building for production'));
    runSequence(
        'indexhtml',
        cb
    );
});

