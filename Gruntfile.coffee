fs = require 'fs'
platform = require('os').platform()

module.exports = (grunt)->

    require('load-grunt-tasks') grunt
    require('time-grunt') grunt

    @initConfig
        pkg: grunt.file.readJSON 'package.json'

        watch:
            js:
                files: ['client/scripts/**/*.js']
                tasks: ['newer:jshint:all']
                options:
                    livereload: true
            css:
                files: ['client/styles/**/*.{scss,sass,css}']
                tasks: ['compass:server', 'autoprefixer']
                options:
                    livereload: true
            html:
                files: ['client/**/*.html']
                options:
                    livereload: true
            server:
                files: ['.nodemon']
                options:
                    livereload: true
            jsTest:
                files: ['test/client/spec/{,*/}*.js']
                tasks: ['newer:jshint:test', 'karma']
            gruntfile:
                files: ['Gruntfile.coffee']

        nodemon:
            dev:
                script: 'app.js'
                options:
                    nodeArgs: ['--harmony']
                    ignore: ['node_modules/**', 'client/**']
                    callback: (nodemon)->
                        fs.writeFileSync '.nodemon', 'started'
                        nodemon.on 'log', (event)->
                            console.log event.colour
                        nodemon.on 'restart', ->
                            setTimeout ->
                                fs.writeSync '.nodemon', 'restarted'
                            , 250

        concurrent:
            tasks: ['nodemon', 'watch']
            options:
                logConcurrentOutput: true

        jshint:
            options:
                jshintrc: '.jshintrc'
                reporter: require('jshint-stylish')
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
            dist:
                files: [{
                    dot: true
                    src: [
                        '.sass-cache'
                        '.tmp'
                        'client/.tmp'
                        'dist'
                    ]
                }]
            server: [
                'client/.tmp'
                '.tmp'
                '.sass-cache'
            ]

        wiredep:
            html:
                src: ['client/index.html']
                exclude: ['bootstrap-social']
                fileTypes:
                    html:
                        replace:
                            js: '<script src="/{{filePath}}"></script>'
                            css:'<link href="/{{filePath}}" />'

        autoprefixer:
            options:
                browsers: ['last 1 version']
            dist:
                files: [{
                    expand: true
                    cwd: 'client/.tmp/styles/'
                    src: '**/*.css'
                    dest: 'client/.tmp/styles/'
                }]

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
                            js: ['concat', 'uglifyjs']
                            css: ['cssmin']
                        post: {}

        usemin:
            html: ['dist/client/{,*/}*.html']
            css: ['dist/client/styles/{,*/}*.css']
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
                files: [{
                    expand: true
                    cwd: 'dist/client'
                    src: ['*.html', 'views/{,*/}*.html']
                    dest: 'dist/client'
                }]

        ngmin:
            dist:
                files: [{
                    expand: true
                    cwd: 'client/.tmp/concat/scripts'
                    src: ['**/*.js', '!**/vendor.js']
                    dest: 'client/.tmp/concat/scripts'
                }]

        ngtemplates:
            dist:
                cwd: 'client/views'
                src: ['**/*.html']
                dest: 'client/.tmp/scripts/app.template.js'
                options:
                    prefix: '/views/'
                    usemin: '/scripts/scripts.js'
                    module: 'kman'
                    htmlmin:
                        collapseWhitespace: true
                        removeComments: true

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
                dist: 'dist/client/images'
                src: ['generated/*']
            fonts:
                expand: true
                cwd: 'client'
                src: [
                    '**/*.{eot,svg,ttf,woff}'
                ]
                dest: 'dist/client'
            server:
                expand: true
                cwd: '.'
                src: ['server/**/*', 'app.js', 'package.json', 'config.js', 'README.md']
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

            fontawesomefonts:
                expand: true
                cwd: 'client/bower_components/font-awesome'
                src: 'fonts/**'
                dest: 'dist/client'

            bootstrapfonts:
                expand: true
                cwd: 'client/bower_components/bootstrap/dist'
                src: 'fonts/**'
                dest: 'dist/client'

        karma:
            unit:
                configFile: 'test/client/karma.conf.js'
                singRun: true

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
    ]

    @registerTask 'dev', ['concurrent']

