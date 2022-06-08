// Karma configuration
// Generated on Fri Jun 05 2015 08:41:10 GMT-0300 (Hora estándar de Argentina)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../src/',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],

    // list of files / patterns to load in the browser
    files: [

        {pattern: 'node_modules/**/*.js', included: false},
        {pattern: 'dist/js/vendor/modernizr-2.8.3.min.js', included: false},
        {pattern: 'dist/js/notificacion/modernizr.custom.js', included: false},
        
        {pattern: 'dist/app/**/**/*.js', included: false},
        {pattern: '../test/**/*.js', included: false},
        '../config/main-dev.js'
    ],

    plugins : [
        'karma-phantomJS-launcher',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-jasmine',
        'karma-requirejs'
    ],

    // list of files to exclude
    exclude: [
        'src/main.js',
        'node_modules/**/*Spec.js',
        'node_modules/**/*.spec.js',
        'node_modules/**/test/**/*.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters:     
    reporters: ['dots'],

    // web server port
    port: 9876,

    //The port where the server will be listening. This is only used when you are using karma run.
    // runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
        'PhantomJS'
        // 'Chrome'
        // 'Firefox'
        // 'Safari'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
});
};