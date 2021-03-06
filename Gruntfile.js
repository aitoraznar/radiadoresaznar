var path = require('path');

module.exports = function (grunt) {

    'use strict';

    // Load Grunt tasks automatically
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    grunt.initConfig({

        // ---------------------------------------------------------------------
        // | Project Settings                                                  |
        // ---------------------------------------------------------------------

        settings: {
            // Configurable paths
            dir: {
                src: 'src',
                dist: 'dist'
            }
        },

        // ---------------------------------------------------------------------
        // | Tasks Configurations                                              |
        // ---------------------------------------------------------------------

        autoprefixer: {
            // In-depth information about the options:
            // https://github.com/nDmitry/grunt-autoprefixer#options
            options: {
                browsers: [ 'last 2 version', 'ie 6', 'ie 7', 'ie 8' ],
                cascade: true
            }
        },

        clean: {
            // List of files that will be removed before the
            // deploy process is started
            all: [
                '.tmp', // used by the `usemin` task
                '<%= settings.dir.dist %>'
            ],

            // List of files no longer required after the deploy
            // process is completed
            tmp: [
                '.tmp'  // used by the `usemin` task
            ]
        },

        cssmin: {
            generated: {
                // In-depth information about the options:
                // https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: '*'
                },
                files: [ 
                    { src: [ 'src/css/style.css' ], dest: 'dist/css/style.css' },
                    { src: [ 'src/css/style-mobile.css' ], dest: 'dist/css/style-mobile.css' },
                    { src: [ 'src/css/style-narrow.css' ], dest: 'dist/css/style-narrow.css' },
                    { src: [ 'src/css/style-narrower.css' ], dest: 'dist/css/style-narrower.css' },
                    { src: [ 'src/css/style-normal.css' ], dest: 'dist/css/style-normal.css' },
                    { src: [ 'src/css/style-wide.css' ], dest: 'dist/css/style-wide.css' },
                    { src: [ 'src/css/font-awesome.min.css' ], dest: 'dist/css/font-awesome.min.css' }
                ]
            }
        },


        connect: {
            options: {
                hostname: '0.0.0.0',  // → Change this to '0.0.0.0' if
                                        // the server needs to be accessed
                                        // from outside of the LAN
                livereload: 35729,
                port: 8080              // → 8080 is used as it is the official
                                        // alternate to port 80 (default port
                                        // for HTTP), and it doesn't require
                                        // root access:
                                        // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
            },
            livereload: {
                options: {
                    base: '<%= settings.dir.src %>',

                    // Automatically open the webpage in the default browser
                    open: true
                }
            }
        },

        copy: {
            files: {
                cwd: '<%= settings.dir.src %>/',
                dest: '<%= settings.dir.dist %>/',
                dot: true,
                expand: true,
                src: [
                    // copy all files
                    '**',

                    // except: files from the `css/` and `js/` directory
                    // (other tasks will handle the copying of these files)
                    '!css/*',
                    '!js/*',
                ]
            }
        },

        filerev: {
            files: {
                src: [
                    '<%= settings.dir.dist %>/js/*.js',
                    '<%= settings.dir.dist %>/css/*.css',
                    '<%= settings.dir.dist %>/images/*.png',
                    '<%= settings.dir.dist %>/images/*.jpg',
                    '!<%= settings.dir.dist %>/js/*.min.js',
                    '!<%= settings.dir.dist %>/css/style.css',
                    '!<%= settings.dir.dist %>/css/style-mobile.css',
                    '!<%= settings.dir.dist %>/css/style-narrow.css',
                    '!<%= settings.dir.dist %>/css/style-narrower.css',
                    '!<%= settings.dir.dist %>/css/style-normal.css',
                    '!<%= settings.dir.dist %>/css/style-wide.css',
                    '!<%= settings.dir.dist %>/css/font-awesome.min.css'
                ]
            },
            options: {
                algorithm: 'sha1',
                length: 7
            }
        },

        jshint: {
            files: [
                'Gruntfile.js',
                '<%= settings.dir.src %>/js/*.js',
                '!<%= settings.dir.src %>/js/*.min.js'
            ],
            options: {
                // Search for `.jshintrc` files relative to files being linted
                jshintrc: true
            }
        },

        htmlmin: {
            build: {
                files: {
                    '<%= settings.dir.dist %>/index.html': '<%= settings.dir.dist %>/index.html'
                    // DO NOT minify the 404 page! (the page needs to have more
                    // than 512 bytes in order for IE to display it)
                    // http://www.404-error-page.com/404-error-page-too-short-problem-microsoft-ie.shtml
                },

                // In-depth information about the options:
                // http://perfectionkills.com/experimenting-with-html-minifier/#options
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: false,
                    removeOptionalTags: false,
                    removeRedundantAttributes: false
                }
            }
        },

        uncss: {
            // In-depth information about the options:
            // https://github.com/addyosmani/grunt-uncss#options
            options: {
                ignoreSheets: [/fonts.googleapis/]
            }
        },

        usemin: {
            // List of files for which to update asset references
            css: '<%= settings.dir.dist %>/css/**/*.css',
            html: '<%= settings.dir.dist %>/index.html'
        },

        useminPrepare: {
            // List of HTML files from which to process the usemin blocks
            // https://github.com/yeoman/grunt-usemin#blocks
            html: '<%= settings.dir.src %>/index.html',

            // Workflow configurations:
            // https://github.com/yeoman/grunt-usemin#flow
            options: {
                flow: {
                    html: {
                        steps: {
                            css: [

                                {
                                    // Note: this task will also take care of concatenation
                                    name: 'uncss',
                                    createConfig: function (context, block) {

                                        // Set the location where this task will created
                                        // its files, so that the next task knows where
                                        // to take them from
                                        context.outFiles = [ block.dest ];

                                        // Task configurations
                                        return {
                                            files: [{
                                                dest: path.join(context.outDir, block.dest),

                                                // List of HTML files that UnCSS will use
                                                // TODO: find a better solution
                                                src: [ '<%= settings.dir.src %>/index.html' ]
                                            }]
                                        };
                                    }
                                },

                                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

                                {
                                    name: 'autoprefixer',
                                    createConfig: function (context, block) {

                                        context.outFiles = [ block.dest ];

                                        // Task configuration
                                        return {
                                            files: [{
                                                src: path.join(context.inDir, block.dest),
                                                dest: path.join(context.outDir, block.dest)
                                            }]
                                        };
                                    }
                                },

                                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

                                'cssmin'

                            ],

                            js: ['concat', 'uglifyjs']

                        },
                        post: {}
                    }
                }
            }
        },

        watch: {
            files: '<%= settings.dir.src %>/**',
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            scripts: {
                files: '<%= jshint.files %>',
                tasks: 'jshint',
                options: {
                    spawn: false
                }
            }
        }

    });

    // -------------------------------------------------------------------------
    // | Main Tasks                                                            |
    // -------------------------------------------------------------------------

    grunt.registerTask('deploy', [
        'clean:all',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'uncss',
        'autoprefixer',
        'cssmin',
        'filerev',
        'usemin',
        'htmlmin',
        'clean:tmp'
    ]);

    // default task
    // (same as `deploy`, as `deploy` will be used more often)
    grunt.registerTask('default', [
        'deploy'
    ]);

    grunt.registerTask('dev', [
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'deploy'
    ]);

};
