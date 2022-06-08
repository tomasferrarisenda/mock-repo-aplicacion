/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('EvolucionLogicService', EvolucionLogicService);

		// Inyección de dependencia
		EvolucionLogicService.$inject = ['Logger', '$uibModal', 'PrintSelectionService'];

		// Definición del servicio
		function EvolucionLogicService ($log, $uibModal, PrintSelectionService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EvolucionLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				method: method
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN  ------------------------------------------ */

			function method () {
				// body...
			}
		}
	};

	return module;

})();