'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],

    files: [
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'src/**/*.js',
      'test/**/*.js',
    ],

    reporters: ['progress', 'junit'],
    junitReporter: { outputFile: 'test/junit.xml' },
    reportSlowerThan: 500,

    preprocessor: { '**/*.html': ['ng-html2js'] },
    ngHtml2JsPreprocessor: { stripPrefix: 'base/' },

    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,
    colors: true,
    singleRun: true
  });

};
