import * as angular from 'angular';

/**
 * @author:			Ezequiel Mansilla
 * @description:	Log
 * @type:			Service
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.provider('Logger', LoggerProvider);

		// LoggerProvider.$inject = [];
		
		function LoggerProvider () : any {

			var isEnabled = true;
			var levelLog : any = true;
			
			this.enabled = function(_isEnabled) {
				isEnabled = !!_isEnabled;
			};

			this.levelLog = function (_levelLog: string) {

				var level : number = parseInt(_levelLog);

				if (level > 0 && level < 5) {
					levelLog = level;
				} else {
					levelLog = 0;
				}
			};

			this.$get = LoggerFactory;

			LoggerFactory.$inject = ['$log', '$filter', '$injector'];

			function LoggerFactory($log, $filter, $injector) {

				var Logger : any = function(context) {
					this.context = context;
				};

				Logger.getInstance = function(context) {
					return new Logger(context);
				};
				
				Logger.supplant = function(str, o) {  
					return str.replace(
						/\{([^{}]*)\}/g,
						function (a, b) {
							var r = o[b];
							return typeof r === 'string' || typeof r === 'number' ? r : a;
						}
					);
				};

				Logger.getFormattedTimestamp = function(date) { 
					// return Logger.supplant('{0}:{1}:{2}:{3}', [
					// 	date.getHours(),
					// 	date.getMinutes(),
					// 	date.getSeconds(),
					// 	date.getMilliseconds()
					// 	]);
					return $filter('date')(date, 'HH:mm:ss:sss');
				};

				Logger.prototype = {  
					// Supports the following arguments: fnName (optional), message (mandatory), supplantData (optional)
					// Length and types of arguments are checked in order to determine the usage
					_log: _logAllende,

					log: function() {
						this._log('log', arguments);
					},
					info: function() {
						this._log('info', arguments);
					},
					warn: function() {
						this._log('warn', arguments);
					},
					debug: function() {
						this._log('debug', arguments);
					},
					error: function() {
						this._log('error', arguments);
					}
				};

				function _logOriginal (originalFn, args) {
					var now  = Logger.getFormattedTimestamp(new Date());
					var type = $filter('uppercase')(originalFn);
					var message = '', supplantData = [];
					switch (args.length) {
						case 1:
							message = Logger.supplant("{0}::{1} - {2}: {3}", [ type, now, this.context, args[0] ]);
							break;
						case 3:
							supplantData = args[2];
							message = Logger.supplant("{0}::{1} - {2}::{3}(\'{4}\')", [ type, now, this.context, args[0], args[1] ]);
							break;
						case 2:
							if (typeof args[1] === 'string') {
								message = Logger.supplant("{0}::{1} - {2}::{3}(\'{4}\')", [ type, now, this.context, args[0], args[1] ]);
							} else {
								supplantData = args[1];
								message = Logger.supplant("{0}::{1} - {2}: {3}", [ type, now, this.context, args[0] ]);
							}
						break;
					}

					$log[originalFn].call(null, Logger.supplant(message, supplantData));
				}

				function _logAllende (originalFn, args) {
					var now  = Logger.getFormattedTimestamp(new Date());
					var type = $filter('uppercase')(originalFn);
					var message = '', supplantData: any = [];

					if (args.length > 0) {

						message = Logger.supplant("{1} - {2}: ", [ type, now, this.context ]);

						switch (args.length) {
							case 1:
								if (typeof args[0] === 'string') {
									message += args[0];
									supplantData = null;
								} else {
									message += 'NN';
									supplantData = args[0];
								}
								break;
							case 2:
								message += args[0];
								supplantData = args[1];
								break;
							default:
								message += args[0];
								for (var i = 0; i < args.length; i++) {
									if (i > 0) {
										supplantData.push(args[i]);
									}
								}
								break;
						}

						if (supplantData) {
							$log[originalFn].call(null, message, supplantData);
						}
						else {
							$log[originalFn].call(null, message);
						}
					}

				}

				return Logger;
			}			
		}
	};

	return module;

})();