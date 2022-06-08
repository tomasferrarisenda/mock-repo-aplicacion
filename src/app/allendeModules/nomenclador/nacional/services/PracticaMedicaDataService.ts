/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PracticaMedicaDataService', PracticaMedicaDataService);

		// Inyección de dependencia
		PracticaMedicaDataService.$inject = ['DotService', 'Logger']

		// Definición del servicio
		function PracticaMedicaDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PracticaMedicaDataService');
			$log.debug('ON.-');
			
			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				getAll : getAll,
				getAllCirugias : getAllCirugias,
				getAllPracticasMedicaPrequirurgicoRayos: getAllPracticasMedicaPrequirurgicoRayos,
				getAllPracticasMedicaPrequirurgicoCardiologia: getAllPracticasMedicaPrequirurgicoCardiologia,
				getAllPracticasMedicaPrequirurgicoLaboratorio: getAllPracticasMedicaPrequirurgicoLaboratorio,
				getAllPracticasMedicaPrequirurgicoAnestesia: getAllPracticasMedicaPrequirurgicoAnestesia,
				getAllPracticasMedicaPrequirurgicoHemoterapia : getAllPracticasMedicaPrequirurgicoHemoterapia,
				getAllPracticasMedicaPrequirurgicoHematologia : getAllPracticasMedicaPrequirurgicoHematologia,
				getAllPracticasMedicaByServicio: getAllPracticasMedicaByServicio,
				getAllPracticasMedicaByTipo: getAllPracticasMedicaByTipo,

				getAllSubPracticasByPractica : getAllSubPracticasByPractica,

				getTipoQuirofano : getTipoQuirofano
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function getAll () {
				var _url = 'legacy/PracticaMedica';
				return DotService.Get(_url);
			}

			function getAllCirugias () {
				var _url = 'legacy/PracticaMedica/Cirugias';
				return DotService.Get(_url);
			}

			function getAllPracticasMedicaPrequirurgicoRayos () {
				var _url = 'legacy/PracticaMedica/PrequirurgicosRayos';
				return DotService.Get(_url);
			}

			function getAllPracticasMedicaPrequirurgicoCardiologia () {
				var _url = 'legacy/PracticaMedica/PrequirurgicosCardiologia';
				return DotService.Get(_url);
			}

			function getAllPracticasMedicaPrequirurgicoLaboratorio () {
				var _url = 'legacy/PracticaMedica/PrequirurgicosLaboratorio';
				return DotService.Get(_url);
			}

			function getAllPracticasMedicaPrequirurgicoAnestesia () {
				var _url = 'legacy/PracticaMedica/PrequirurgicosAnestesia';
				return DotService.Get(_url);
			}

			function getAllPracticasMedicaPrequirurgicoHemoterapia () {
				var _url = 'legacy/PracticaMedica/PrequirurgicosHemoterapia';
				return DotService.Get(_url);
			}

			function getAllPracticasMedicaPrequirurgicoHematologia () {
				var _url = 'legacy/PracticaMedica/PrequirurgicosHematologia';
				return DotService.Get(_url);
			}

			function getAllPracticasMedicaByServicio (pServicio) {
				var _url = 'legacy/PracticaMedica/ServicioMedico';
				return DotService.Post(_url, pServicio);
			}

			function getAllPracticasMedicaByTipo (pTipo) {
				var _url = 'legacy/PracticaMedica/ByTipo/';
				return DotService.Post(_url, pTipo);
			}

			function getAllSubPracticasByPractica (pId) {
				var _url = 'legacy/SubPracticaMedica/ByPractica/' + pId;
				return DotService.Get(_url);
			}

			function getTipoQuirofano () {
				var _url = 'legacy/TipoPracticaMedica/Quirofano';
				return DotService.Get(_url);
			}
		}
	};

	return module;

})();