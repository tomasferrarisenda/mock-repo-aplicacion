/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ServicioMedicoDataService', ServicioMedicoDataService);

		// Inyección de dependencia
		ServicioMedicoDataService.$inject = ['DotService', 'Logger']

		// Definición del servicio
		function ServicioMedicoDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServicioMedicoDataService');
			$log.debug('ON.-');
			
			/* ------------------------------------------- API Y VARIABLES ------------------------------------------- */

			const service = {
				getServicioMedicoRayos : getServicioMedicoRayos,
				getServicioMedicoLaboratorioCentral : getServicioMedicoLaboratorioCentral,
				getServicioMedicoCardiologia : getServicioMedicoCardiologia,
				getServicioMedicoAnestesia : getServicioMedicoAnestesia,
				getServicioMedicoHemoterapia : getServicioMedicoHemoterapia,
				getServicioMedicoHematologia : getServicioMedicoHematologia
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getServicioMedicoRayos () {
				var _url = 'legacy/ServicioMedico/Rayos';
				return DotService.Get(_url);
			}

			function getServicioMedicoLaboratorioCentral() {
				var _url = 'legacy/ServicioMedico/LaboratorioCentral';
				return DotService.Get(_url);
			}

			function getServicioMedicoCardiologia() {
				var _url = 'legacy/ServicioMedico/Cardiologia';
				return DotService.Get(_url);
			}

			function getServicioMedicoAnestesia() {
				var _url = 'legacy/ServicioMedico/Anestesia';
				return DotService.Get(_url);
			}

			function getServicioMedicoHemoterapia () {
				var _url = 'legacy/ServicioMedico/Hemoterapia';
				return DotService.Get(_url);
			}

			function getServicioMedicoHematologia () {
				var _url = 'legacy/ServicioMedico/Hematologia';
				return DotService.Get(_url);
			}
		};
	};

	return module;

})();