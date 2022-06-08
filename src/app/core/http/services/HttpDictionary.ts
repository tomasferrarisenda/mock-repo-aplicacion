/**
 * @author:			Ezequiel Mansilla
 * @description:	Interceptor que valida dictionary
 * @type:			Service
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(httpDictionary);

		httpDictionary.$inject = ['$httpProvider'];
		function httpDictionary($httpProvider) {
			$httpProvider.interceptors.push('HttpDictionary');
		}

		ngModule.factory('HttpDictionary', HttpDictionary);

		HttpDictionary.$inject = ['$q', 'APP_INFO'];
		
		function HttpDictionary ($q, APP) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			// $log = $log.getInstance('HttpDictionary');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				request : request
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function request (config) {
				config.headers = config.headers || {};
				
				if (config.dictionary) {
					config.headers = {
						'From' : APP.name,
						'Accept' : 'application/json',
						'Content-Type' : 'application/json'
					};
				} else if (config.contentTypeEspecifico) {
					config.headers = {
						'From' : APP.name
					};
				} else if (!config.headersEspecificos) {
					config.headers = {
						'From' : APP.name,
						'Content-Type' : 'application/json'
					};
				}
				return $q.when(config);
			}
		}
	};

	return module;
})();