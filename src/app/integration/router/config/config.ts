/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo para rutas basicas
 * @type:			Config
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		/* Configuración de urlRouterProvider */
		ngModule.config(configUrlRouter);

		configUrlRouter.$inject = ['$urlRouterProvider'];
		function configUrlRouter ($urlRouterProvider) {
			// Prevent $urlRouter from automatically intercepting URL changes;
			// this allows you to configure custom behavior in between
			// location changes and route synchronization:
			$urlRouterProvider.deferIntercept();
		}
	};

	return module;

})();