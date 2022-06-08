/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('ExceptionCatcher', ExceptionCatcher);

		ExceptionCatcher.$inject = ['Logger', '$q', '$rootScope'];
		
		function ExceptionCatcher ($log, $q, $rootScope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ExceptionCatcher');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				catcher: catcher,
				httpCatcher: httpCatcher
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/**
			* @ngdoc function
			* @name ExceptionCatcher#catcher
			* @methodOf core.exception.service:ExceptionCatcher
			*
			* @description
			* Handles an exception with its message.
			*
			* @param {string} event - Name of the event that caused the error.
			* @param {string} message - Message for the exception.
			* @param {object} reason - Object with more information about the error.
			*/
			function catcher(event, message, reason) {
				// $log.debug(event + ': ' + message, reason);
				$log.debug(event + ': ' + message);
			}

			/**
			* @ngdoc function
			* @name ExceptionCatcher#httpCatcher
			* @methodOf core.exception.service:ExceptionCatcher
			*
			* @description
			* Handles HTTP errors.
			*
			* @param {Object} error - Error object.
			* @param {number} status - HTTP status code.
			* @param {Object} config - Object with the request data.
			*/
			function httpCatcher(error, status, config) {
				var message = 'Error: ' + JSON.stringify(error) + '\n' + 'Status: ' + status + '\n';

				if (config && config.headers && config.headers.authorization) {
					config.headers.authorization = config.headers.authorization.replace(/./g, '*');
				}

				if (config.data && config.data.password) {
					config.data.password = config.data.password.replace(/./g, '*');
				}

				if (config.params && config.params.appid) {
					config.params.appid = config.params.appid.replace(/./g, '*');
				}

				catcher('HTTP_ERROR', message, config);
			}
		}
	};

	return module;
})();