module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                files: {
                    'js/translation.min.js': ['js/translation.js']
                }
            }
        },
        watch: {
            scripts: {
                files: '**/translation.js',
                tasks: ['uglify'],
                options: {
                    interrupt: true,
                },
            },
        },
        jshint: {
            files: [
                'js/translation.js',
            ],
            options: {
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', [ 'jshint', 'uglify' ]);
    grunt.registerTask('watch', [ 'jshint', 'uglify', 'watch' ]);
};