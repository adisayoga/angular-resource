'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: 'dist/*'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: ['src/**/*.js']
    },

    concat: {
      options: {
        banner: '(function($, angular, undefined) {\n',
        footer: '})(jQuery, angular);'
      },
      src: {
        files: {
          'dist/resource.min.js': ['src/**/*.js']
        }
      }
    },

    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          dest: 'dist',
          src: '*.js'
        }]
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '/**\n' +
                  ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                  ' * Copyright (c) 2010-2014 Google, Inc. http://angularjs.org\n' +
                  ' *           (c) 2014 Adi Sayoga \n' +
                  ' * License: MIT\n' +
                  ' */\n'
        },
        files: [{
          expand: true,
          cwd: 'dist',
          dest: 'dist',
          src: '*.js'
        }]
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'ngmin:dist',
    'uglify:dist'
  ]);
};
