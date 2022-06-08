/*! app-sanatorio-allende - by emansilla -17-03-2016 */
module.exports = function (grunt) {

	// loadNpmTasks
	// Recorre la lista de dependencias y carga dichos modulos
	require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);
	var webpackConfigLocal = require('./webpack.config');
	var webpackConfigProd = require('./webpack.prod.config');

	// Project configuration.
	grunt.initConfig({

		// Data
		pkg : grunt.file.readJSON('package.json'),
		appConfig : grunt.file.readJSON('config/app.conf.json'),

		outdir : 'dist',
		baseprod : 'dist/',
		basedev : 'src/',

		distAllFiles : '<%= basedev %><%= outdir %>/',
	
		// Tasks
		ngconstant: {
			options: {
				name: 'config',
				dest: '<%= basedev %>app/config/app.ts',
				wrap: 'import * as angular from \'angular\'; export const ConfigModule = \n {%= __ngModule %} \n\n ',
				constants: {
					APP_INFO: '<%= pkg %>'
				}
			},
			// Environment targets
			local: {
				constants: {
					ENV: '<%= appConfig.LOCAL %>',
					DEBUG: true
				}
			},
			dev: {
				constants: {
					ENV: '<%= appConfig.DEV %>',
					DEBUG: true
				}
			},
			k8s: {
				constants: {
					ENV: '<%= appConfig.K8S %>',
					DEBUG: true
				}
			},
			test: {
				constants: {
					ENV:'<%= appConfig.TEST %>',
					DEBUG: true
				}
			},
			stage: {
				constants: {
					ENV: '<%= appConfig.STAGE %>',
					DEBUG: true
				}
			},
			prod: {
				constants: {
					ENV:'<%= appConfig.PROD %>',
					DEBUG: false
				}
			}
		},
		clean : {
			distAll : '<%= distAllFiles %>',
			dist :  '<%= baseprod %>/',
			deploy :  ['sftp_cache_dev.json', 'sftp_cache_test.json', 'sftp_cache_prod.json']
		},
		copy: {
			indexLocal: {
				src: 'src/index.local.ejs',
				dest: 'src/index.ejs'
			},
			indexV1: {
				src: 'src/index.v1.ejs',
				dest: 'src/index.ejs'
			},
			ico: {
				src: 'src/img/favicon.ico',
				dest: 'dist/favicon.ico'
			},
			touch: {
				src: 'src/img/logo-sa-grande.png',
				dest: 'dist/logo-sa-grande.png'
			},
			pdf: { 
				expand: true,
				cwd: 'src/pdf/',
				src: '*',
				dest: 'dist/pdf/'
			}
		},
		// uglify : {
		// 	options : {
		// 		banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - by <%= pkg.authors %> -' +
		// 		'<%= grunt.template.today("dd-mm-yyyy") %> */',
		// 		mangle : false, // false to prevent changes to your variable and function names.
		// 		compress : {
		// 			drop_console : true // true to discard calls to console.* functions
		// 		}
		// 	},
		// 	build : {
		// 		options : {
		// 			beautify : false
		// 		},
		// 		files : '<%= jsFiles %>'
		// 	}
		// }, // uglify
		webpack: {
			prod: webpackConfigProd,
			test: webpackConfigProd,
			dev: webpackConfigProd,
			stage: webpackConfigProd,
			local: webpackConfigLocal
		},
		karma : {
			unit : {
				configFile : 'config/karma.conf.js',
				autoWatch : false,
				singleRun : true
			},
			unit_auto : {
				configFile : 'config/karma.conf.js'
			}
		}, // karma
		'sftp-deploy': {
			dev: {
				auth: {
					host: '192.168.32.12',
					port: 22,
					authKey: 'key_dev'
				},
				cache: 'sftp_cache_dev.json',
				src: 'dist',
				dest: '/var/www/html/appdev/v1',
				serverSep: '/',
				localSep: '\\',
				concurrency: 4,
				progress: false
			},
			test: {
				auth: {
					host: '192.168.32.33',
					port: 22,
					authKey: 'key_test'
				},
				cache: 'sftp_cache_test.json',
				src: 'dist',
				dest: '/var/www/html/apptest/v1',
				serverSep: '/',
				localSep: '\\',
				concurrency: 4,
				progress: false
			},
			stage: {
				auth: {
					host: '192.168.32.33',
					port: 22,
					authKey: 'key_test'
				},
				cache: 'sftp_cache_test.json',
				src: 'dist',
				dest: '/var/www/html/appstage/v1',
				serverSep: '/',
				localSep: '\\',
				concurrency: 4,
				progress: false
			},
			prod: {
				auth: {
					host: '10.7.0.240',
					port: 2423,
					authKey: 'key_prod'
				},
				cache: 'sftp_cache_prod.json',
				src: 'dist',
				dest: '/var/www/html/app/v1',
				serverSep: '/',
				localSep: '\\',
				concurrency: 4,
				progress: false
			}
		} // sftp-deploy
	});

	// options
	var ENV = grunt.option('env') || 'local';

	// Run Default task(s).
	grunt.registerTask('default', ['webpack-dev-server']);

	// DEVELOPMENT
	grunt.registerTask('compile:init', 'Selection environment mode to compile all.', function (environment) {
		if (environment)
			ENV = environment;

		switch(ENV) {
			case 'local':
				grunt.task.run('ngconstant:local');
				grunt.task.run('copy:indexLocal');
				grunt.task.run('clean:dist');
				break;
			case 'prod':
				grunt.task.run('ngconstant:prod');
				grunt.task.run('clean:dist');
				grunt.task.run('copy');
				break;
			case 'stage':
				grunt.task.run('ngconstant:stage');
				grunt.task.run('clean:dist');
				grunt.task.run('copy');
				break;
			case 'test':
				grunt.task.run('ngconstant:test');
				grunt.task.run('clean:dist');
				grunt.task.run('copy');
				break;
			case 'dev':
				grunt.task.run('ngconstant:dev');
				grunt.task.run('clean:dist');
				grunt.task.run('copy');
				break;
			case 'k8s':
				grunt.task.run('ngconstant:k8s');
				grunt.task.run('clean:dist');
				grunt.task.run('copy');
				break;
			default:
				grunt.fail.fatal("Doesn´t exist.");
				break;
		}
	});

	// Registramos la tarea default (Se ejecuta sin parametros)
	// Ejecuta las tareas mencionadas entre corchetes
	grunt.registerTask('compile', 'Selection environment mode to compile all.', function () {
		grunt.task.run('compile:init');
		grunt.task.run('webpack:' + ENV);
	});

	grunt.registerTask('deploy', 'Selection environment mode to deploy.', function (environment) {
		
		if (environment)
			ENV = environment;

		// Elijo las tareas segun environment
		switch(ENV) {
			case 'prod':
				grunt.task.run('clean:deploy', 'sftp-deploy:prod');
				break;
			case 'test':
				grunt.task.run('clean:deploy', 'sftp-deploy:test');
				break;
			case 'stage':
				grunt.task.run('clean:deploy', 'sftp-deploy:stage');
				break;
			case 'dev':
				grunt.task.run('clean:deploy', 'sftp-deploy:dev');
				break;
			default:
				grunt.fail.fatal("Doesn´t exist.");
				break;
		}
	});
	
	// TESTING
	grunt.registerTask('test', ['test:unit']);
	grunt.registerTask('test:unit', ['karma:unit']);
};