module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				//eqeqeq: true,
				trailing: true
			},
			files: ['Gruntfile.js', 'src/*.js']
		},
		uglify: {
			buildall: {
				options: {
				},
				files: {
					'build/<%= pkg.name%>.min.js': 'src/<%= pkg.name%>.js'
				}
			}
		},
		cssmin:{
			options: {
				keepSpecialComments: 0
			},
			compress: {
				files: {
					'build/<%= pkg.name%>.min.css': 'src/<%= pkg.name%>.css'
				}
			}
		},
		watch: {
			scripts: {
				files: '**/*.js',
				taskes: 'jshint',
				options: {
					livereload: true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-concat-sourcemap');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['uglify:buildall', 'cssmin', 'watch', 'jshint']);
};