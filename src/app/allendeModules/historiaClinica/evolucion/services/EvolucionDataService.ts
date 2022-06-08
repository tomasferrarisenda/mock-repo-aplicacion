/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('EvolucionDataService', EvolucionDataService);

		// Inyección de dependencia
		EvolucionDataService.$inject = ['DotService', 'Logger', 'HTTP_METHOD'];

		// Definición del servicio
		function EvolucionDataService (DotService, $log, HTTP_METHOD) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EvolucionDataService');
			$log.debug('ON.-');
			
			/* ------------------------------------------- API Y VARIABLES ------------------------------------------- */

			const service = {
				method: method
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function method () {
				// body...
			}
		}
	};

	return module;

})();