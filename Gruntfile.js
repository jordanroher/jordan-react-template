const webpackConfig = require('./webpack.config');

module.exports = function (grunt) {
	grunt.initConfig({
		clean: {
			dist: [
				"dist/**"
			]
		},

		webpack: {
			prod: webpackConfig
		},

		uglify: {
			main: {
				files: [{
					expand: true,
					cwd: "./dist/js",
					src: "**/*.js",
					dest: "./dist/js"
				}]
			},
			lib: {
				files: {
					"./dist/js/lib.js": [
						"./node_modules/react/dist/react.js",
						"./node_modules/react-dom/dist/react-dom.js",
					]
				}
			}
		},

		cssmin: {
			main: {
				files: [{
					expand: true,
					cwd: "dist/css",
					src: ["*.css", "!*.min.css"],
					dest: "dist/css"
				}]
			}
		},

		replace: {
			main: {
				options: {
					patterns: [{
						match: /<script/gi,
						replacement: "<script type=\"text/javascript\" src=\"/js/lib.js\"></script><script"
					},
					{
						match: /<script type=\"text\/javascript\" src=\"js\/app\./gi,
						replacement: "<script type=\"text/javascript\" src=\"/js/app."
					},
					{
						match: /<link href=\"([A-Z0-9\.\/]+)\" rel=\"stylesheet\">/gi,
						replacement: "<link href=\"$1\" rel=\"stylesheet\" \/>"
					}]
				},
				files: [{
					src: ["dist/*.html", "dist/**/*.html"],
					expand: true
				}]
			}
		},

		prettify: {
			options: {
				"indent": 1,
				"indent_char": "	"
			},
			html: {
				expand: true,
				cwd: "dist/",
				ext: ".html",
				src: ["*.html", "**/*.html"],
				dest: "dist/"
			}
		},
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-prettify");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-replace");
	grunt.loadNpmTasks("grunt-webpack");

	grunt.registerTask("default", [
		"clean:dist",
		"webpack:prod",
		"uglify:main",
		"uglify:lib",
		"cssmin:main",
		"replace:main",
		"prettify"
	]);
};