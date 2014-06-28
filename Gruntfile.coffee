fs = require 'fs'
stylish = require 'jshint-stylish'
open = require 'open'
platform = require('os').platform()

module.exports = (grunt)->

    require('load-grunt-tasks') grunt
    require('time-grunt') grunt

    @initConfig
        pkg: grunt.file.readJSON 'package.json'

        watch:
            js:
                files: [
                    'client/scripts/**/*.js'
                ]
                tasks: [
                    'newer:jshint:all'
                ]
                options:
                    livereload: true
            css:
                files: [
                    'client/styles/**/*.css'
                    'client/.tmp/styles/**/*.css'
                ]
                options:
                    livereload: true
            html:
                files: [
                    'client/**/*.html'
                ]
                options:
                    livereload: true
            sass:
                files: [
                    'client/styles/**/*.{scss,sass,css}'
                ]
                tasks: [
                    'compass:server'
                    'autoprefixer'
                ]
            server:
                files: [
                    '.nodemon'
                ]
                options:
                    livereload: true
            jsTest:
                files: [
                    'test/client/spec/{,*/}*.js'
                ]
                tasks: [
                    'newer:jshint:test'
                    'karma'
                ]
            gruntfile:
                files: [
                    'Gruntfile.coffee'
                ]

        nodemon:
            dev:
                script: 'app.js'
                options:
                    nodeArgs: [
                        '--harmony'
                    ]
                    ignore: [
                        'node_modules/**'
                        'client/**'
                    ]
                    callback: (nodemon)->
                        fs.writeFileSync '.nodemon', 'started'
                        nodemon.on 'log', (event)->
                            console.log event.colour
                        nodemon.on 'config:update', ->
                            console.log 'The default browser will open, wait a moment please.'
                            setTimeout ->
                                open 'http://localhost:3000'
                            , 2000 # 时间太短的话, server还没启动完毕, 浏览器就打开了
                        nodemon.on 'restart', ->
                            setTimeout ->
                                fs.writeFileSync '.nodemon', 'restarted'
                            , 2000 # 时间太短的话, server还没启动完毕, 浏览器就刷新了

        concurrent:
            tasks: [
                'nodemon'
                'watch'
            ]
            options:
                logConcurrentOutput: true

        jshint:
            options:
                jshintrc: '.jshintrc'
                reporter: stylish
            all:
                src: [
                    'client/scripts/**/*.js'
                ]
            test:
                options:
                    jshintrc: 'test/client/.jshintrc'
                src: [
                    'test/client/spec/**/*.js'
                ]

        clean:
            dist: [
                '.sass-cache'
                '.tmp'
                'client/.tmp'
                'dist'
            ]
            server: [
                'client/.tmp'
                '.tmp'
                '.sass-cache'
            ]

        wiredep:
            html:
                src: [
                    'client/index.html'
                ]
                exclude: [
                    'bootstrap-social'
                ]
                fileTypes:
                    html:
                        replace:
                            js: '<script src="/{{filePath}}"></script>'
                            css:'<link rel="stylesheet" href="/{{filePath}}" />'

        autoprefixer:
            options:
                browsers: [
                    'last 1 version'
                ]
            dist:
                expand: true
                cwd: 'client/.tmp/styles/'
                src: '**/*.css'
                dest: 'client/.tmp/styles/'

        compass:
            options:
                sassDir: 'client/styles'
                cssDir: 'client/.tmp/styles'
                generatedImagesDir: 'client/.tmp/images/generated'
                imagesDir: 'client/images'
                javascriptsDir: 'client/scripts'
                fontsDir: 'client/styles/fonts'
                importPath: 'client/bower_components'
                httpImagesPath: '/images'
                httpGeneratedImagesPath: '/images/generated'
                httpFontsPath: '/styles/fonts'
                relativeAssets: false
                assetCacheBuster: false
                raw: 'Sass::Script::Number.precision = 10\n'
            dist:
                options:
                    generatedImagesDir: 'dist/client/images/generated'
            server:
                options:
                    debugInfo: true

        filerev:
            dist:
                src: [
                    'dist/client/scripts/{,*/}*.js',
                    'dist/client/styles/{,*/}*.css',
                    'dist/client/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'dist/client/styles/fonts/*'
                ]

        useminPrepare:
            html: 'client/index.html'
            options:
                dest: 'dist/client'
                staging: 'client/.tmp'
                flow:
                    html:
                        steps:
                            js: [
                                'concat'
                                'uglifyjs'
                            ]
                            css: [
                                'cssmin'
                            ]
                        post: {}

        usemin:
            html: [
                'dist/client/{,*/}*.html'
            ]
            css: [
                'dist/client/styles/{,*/}*.css'
            ]
            options:
                assertsDirs: [
                    'dist/client'
                    'dist/client/images'
                ]

        htmlmin:
            dist:
                options:
                    collapseWhitespace: true
                    removeComments: true
                expand: true
                cwd: 'dist/client'
                src: [
                    '*.html'
                    'views/{,*/}*.html'
                ]
                dest: 'dist/client'

        ngmin:
            dist:
                expand: true
                cwd: 'client/.tmp/concat/scripts'
                src: [
                    '**/*.js'
                ]
                dest: 'client/.tmp/concat/scripts'

        ngtemplates:
            dist:
                options:
                    prefix: '/views/'
                    usemin: '/scripts/scripts.js'
                    module: 'kman'
                    htmlmin:
                        collapseWhitespace: true
                        removeComments: true
                cwd: 'client/views'
                src: [
                    '**/*.html'
                ]
                dest: 'client/.tmp/ngtemplates/app.template.js'

        copy:
            asserts:
                expand: true
                dot: true
                cwd: 'client'
                dest: 'dist/client'
                src: [
                    '*.{ico,png,txt}'
                    '.htaccess'
                    '*.html'
                    'views/{,*/}*.html'
                    'images/{,*/}*.{webp,jpg,ico,png}'
                    'fonts/*'
                ]
            images:
                expand: true
                cwd: 'client/.tmp/images'
                dest: 'dist/client/images'
                src: [
                    'generated/*'
                ]
            fonts:
                expand: true
                cwd: 'client'
                flatten: true
                filter: 'isFile'
                src: [
                    '**/*.{eot,svg,ttf,woff}'
                ]
                dest: 'dist/client/fonts/'
            server:
                expand: true
                cwd: '.'
                src: [
                    'server/**/*'
                    'app.js'
                    'package.json'
                    'config.js'
                    'README.md'
                ]
                dest: 'dist'
            styles:
                expand: true
                cwd: 'client/styles'
                dest: 'client/.tmp/styles'
                src: '**/*.css'

            bower_components:
                expand: true
                cwd: 'client'
                src: 'bower_components/**/*'
                dest: 'dist/client'

        karma:
            unit:
                configFile: 'test/client/karma.conf.js'
                singRun: true

        compress:
            dist:
                options:
                    archive: 'zips/<%= pkg.name %>-V<%= pkg.version %>.zip'
                expand: true
                cwd: 'dist/'
                src: [
                    '**/*'
                ]
                dest: '<%= pkg.name %>'

        shell:
            md5:
                options:
                    stdout: true
                command: "#{if platform ==  'darwin' then 'md5' else 'md5sum'} zips/<%= pkg.name %>-V<%= pkg.version %>.zip"

    @registerTask 'build', [
        'clean'
        'wiredep'
        'useminPrepare'
        'compass:dist'
        'autoprefixer'
        'ngtemplates'
        'concat'
        'ngmin'
        'copy'
        'cssmin'
        'uglify'
        'filerev'
        'usemin'
        'htmlmin'
        'compress'
        'shell'
    ]

    @registerTask 'dev', [
        'concurrent'
    ]

