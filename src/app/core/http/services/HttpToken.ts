/**
 * @author:			Ezequiel Mansilla
 * @description:	Interceptor que valida token
 * @type:			Service
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(httpToken);

		httpToken.$inject = ['$httpProvider'];
		function httpToken($httpProvider) {
			$httpProvider.interceptors.push('HttpToken');
		}

		ngModule.factory('HttpToken', HttpToken);

		HttpToken.$inject = ['$q', '$rootScope', '$injector'];
		
		function HttpToken ($q, $rootScope, $injector) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			// $log = $log.getInstance('HttpToken');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				request : request
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function request (config) {
				config.headers = config.headers || {};

				if ($rootScope.globals.currentUser && $rootScope.globals.currentUser.fr && $rootScope.globals.currentUser.fr._fra) {

					//tengo que inyectar el local storage service
					let _sto = $injector.get("StorageService").get('globals');

					config.headers.Authorization =  'Bearer ' + _sto.currentUser.fr._fra;
					config.headers.CompanyId =  $rootScope.globals.currentUser.IdEmpresa;
				} else {
					// config.headers.Authorization =  'Bearer ';
					var clientId = "AppSA";
					var clientSecret = "7SeGvoNkZze03n6L";
					var authorizationBasic = window.btoa(clientId + ':' + clientSecret);
					config.headers.Authorization = 'Basic ' + authorizationBasic;
				}
				return $q.when(config);
			}
		}
	};

	return module;
})();