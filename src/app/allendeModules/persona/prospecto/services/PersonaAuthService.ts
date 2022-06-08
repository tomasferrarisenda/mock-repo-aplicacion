/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PersonaAuthService', PersonaAuthService);

		PersonaAuthService.$inject = ['Logger'];
		
		function PersonaAuthService ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PersonaAuthService');
			$log.debug('ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				method : method
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function method () {
				
			}
		};
	};

	return module;

})();