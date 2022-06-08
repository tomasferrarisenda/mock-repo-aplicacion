/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('EmpresaAuthService', EmpresaAuthService);

		EmpresaAuthService.$inject = ['Logger'];
		
		function EmpresaAuthService ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EmpresaAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction : resolveAction
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function resolveAction () {
				// body...
			}
		};
	};

	return module;

})();