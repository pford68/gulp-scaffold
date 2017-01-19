/**
 * Configuration for browserify and its plugins and transforms
 */

let config = require('config'),
    watchify = require('watchify'),
    dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

Object.assign(config, {
    browserify: {
        entries: './main.ts',
        basedir: './src/ts',
        debug: config.debug,
        cache: {},
        packageCache: {},
        plugin: [
            [watchify, {poll:true}]   // poll = true has been necessary on my work laptop.
        ]
    },
    tsify: {
        target: 'ES6',                  // Necessary, even though the app builds without it when Watchify is active.
        noImplicitAny: false,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        noEmitHelpers: false
    },
    babelify: {
        presets: ['latest', 'angular2'],   // https://github.com/shuhei/babel-angular2-app/issues/28
        extensions: ['.ts', '.js']
    }
});

// Watchify would prevent Jenkins jobs from ending.
if (!dev){
    delete config.browserify.plugin;
}
module.exports = config;