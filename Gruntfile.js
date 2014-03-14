module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'stylesheets/*'
                ],
                dest: 'all.css'
            },
            js: {
                src: [
                    'javascripts/*'
                ],
                dest: 'all.js'
            }
        },
        cssmin: {
            css: {
                src: 'all.css',
                dest: 'all.min.css'
            }
        },
        uglify: {
            js: {
                files: {
                    'all.js': ['all.js']
                }
            }
        },
        watch: {
          files: ['css/*', 'js/*'],
          tasks: ['concat', 'cssmin', 'uglify']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat:css', 'cssmin:css', 'concat:js', 'uglify:js']);
};
