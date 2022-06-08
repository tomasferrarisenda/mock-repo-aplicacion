/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(httpRequestCounter);

		httpRequestCounter.$inject = ['$httpProvider'];
		function httpRequestCounter($httpProvider) {
			$httpProvider.interceptors.push('HttpRequestCounter');
		}

		ngModule.factory('HttpRequestCounter', HttpRequestCounter);

		HttpRequestCounter.$inject = ['$q'];
		
		function HttpRequestCounter ($q) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			// $log = $log.getInstance('HttpRequestCounter');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var requests = 0;

			const service = {
				request : request,
				requestError : requestError,
				response : response,
				responseError : responseError,
				getRequestCount : getRequestCount
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function request (config) {
				requests += 1;
				return $q.when(config);
			}

			function requestError(error) {
				requests -= 1;
				return $q.reject(error);
			}

			function response (response) {
				requests -= 1;
				return $q.when(response);
			}

			function responseError (error) {
				requests -= 1;
				return $q.reject(error);
			}

			function getRequestCount () {
				return requests;
			}

		}
	};

	return module;
})();