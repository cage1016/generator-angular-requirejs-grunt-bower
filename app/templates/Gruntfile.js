// Gruntfile
/*jslint devel: true, node: true, white:true */

module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var mvcConfig = {
        js: 'js',
        release: 'release',
        tmp: 'tmp'
    };

    grunt.initConfig({
        mvc: mvcConfig,
        clean: {
            release: ['<%%= mvc.release %>/'],
            tmp: ['<%%= mvc.tmp %>/']
        },
        copy: {
            vendor: {
                files: [ <%= files %> ]
            },
            module: {
                files: [{
                    expand: true,
                    cwd: '<%%= mvc.js %>',
                    src: ['app.js', 'config.js', 'controllers/**', 'directives/**', 'filters/**', 'services/**', 'views/**'],
                    dest: '<%%= mvc.tmp %>'
                }]
            },
            basic: {
                files: [{
                    expand: true,
                    cwd: '<%%= mvc.tmp %>/vendor',
                    src: ['jquery.min.js', 'bootstrap.min.js'],
                    dest: '<%%= mvc.release %>/vendor'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: '<%%= mvc.js %>/css/bootstrap/css',
                    src: ['bootstrap.css'],
                    dest: '<%%= mvc.tmp %>/css'
                }, {
                    expand: true,
                    cwd: '<%%= mvc.js %>/css/bootstrap/fonts',
                    src: ['*.*'],
                    dest: '<%%= mvc.release %>/fonts'
                }]
            }
        },
        requirejs: {
            compile: {
                options: {
                    appDir: '<%%= mvc.tmp %>',
                    baseUrl: './',
                    dir: '<%%= mvc.release %>',
                    removeCombined: true,
                    preserveLicenseComments: false,
                    paths: {
                        'angular': '../<%%= mvc.tmp %>/vendor/angular',
                        'jquery': '../<%%= mvc.tmp %>/vendor/jquery.min',
                        'moment': '../<%%= mvc.tmp %>/vendor/moment.min',
                        'respond': '../<%%= mvc.tmp %>/vendor/respond',
                        'domReady': '../<%%= mvc.tmp %>/vendor/domReady',
                        'bootstrap': '../<%%= mvc.tmp %>/vendor/bootstrap.min',
                        <%= gruntFileRequirejsPath %>
                    },
                    shim: {
                        'moment': {
                            exports: 'moment'
                        },
                        'angular': {
                            deps: ['jquery', 'moment'],
                            exports: 'angular'
                        },
                        'respond': {
                            exports: 'respond'
                        },

                        'bootstrap': {
                            deps: ['jquery'],
                            exports: 'bootstrap'
                        },
                        <%= requireShim %>
                    },
                    modules: [{
                        name: 'views/Home/index'
                    }],
                    onBuildRead: function(moduleName, path, contents) {
                        if (moduleName === 'config') {
                            var x = (function(contents) {
                                var regex = /'(vendor|libs)[^']*'/gm;
                                var matches = contents.match(regex);
                                for (var i = 0; i < matches.length; i++) {
                                    var match = matches[i];
                                    var m = matches[i].split('/');
                                    contents = contents.replace(match, '\'vendor/' + m[m.length - 1].toLowerCase());
                                }
                                return contents;
                            })(contents);

                            return x.replace(/\/public\/js/g, '/public/release');
                        }
                        return contents;
                    },
                    urlArgs: "bust=v4"
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['<%%= mvc.tmp %>/vendor/*.js'],
                dest: '<%%= mvc.tmp %>/vendor/libs.js'
            }
        },
        uglify: {
            build: {
                src: ['<%%= mvc.release %>/**/*.html'],
                dest: '<%%= mvc.release %>/**/*.min.html'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: '<%%= mvc.release %>/views',
                    src: ['**/*.html'],
                    dest: '<%%= mvc.release %>/views'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: [
                'Gruntfile.js',
                '<%%= mvc.js %>/{,*/}*.js',
                '!<%%= mvc.js %>/vendor/{,*/}*.js',
                '!<%%= mvc.js %>/libs/{,*/}*.min.js',
                '!<%%= mvc.js %>/helpers/string.js',
                'test/spec/{,*/}*.js'
            ]
        },
        cssmin: {
            combine: {
                files: {
                    '<%%= mvc.release %>/css/main.css': ['<%%= mvc.tmp %>/css/*.css']
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-piece-modulejs');

    // task
    grunt.registerTask('build', [
        'clean:release',
        'clean:tmp',
        'copy:vendor',
        'copy:module',
        'requirejs',
        'copy:basic',
        'copy:css',
        'cssmin',
        'clean:tmp',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};