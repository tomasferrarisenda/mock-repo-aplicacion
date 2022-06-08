import { IDtoService } from "core/http";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('InternacionCommonDataService', InternacionCommonDataService);

		InternacionCommonDataService.$inject = ['DotService', 'Logger'];
		
		function InternacionCommonDataService (DotService: IDtoService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternacionCommonDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAllPrioridadesSolicitud : getAllPrioridadesSolicitud,
				getAllEstadosPaciente : getAllEstadosPaciente,
				getAllEstadoInternacion : getAllEstadoInternacion,
				getAllTiposInternacion : getAllTiposInternacion,
				getAllTipoAlta : getAllTipoAltaInternacion,
				getAllEstadoAdmision : getAllEstadoAdmision,
				getAllDificultadesGestion : getAllDificultadesGestion,
				getAllTipoPacienteFacturacion : getAllTipoPacienteFacturacion,

				addObservacion : addObservacion
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getAllPrioridadesSolicitud () {
				var _url = 'legacy/PrioridadSolicitud';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllEstadosPaciente () {
				var _url = 'legacy/EstadoPaciente';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllDificultadesGestion() {
				var _url = 'legacy/DificultadGestion';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllEstadoInternacion () {
				var _url = 'legacy/EstadoInternacion/';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllEstadoAdmision () {
				var _url = 'legacy/EstadoAdmision/';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTiposInternacion () {
				var _url = 'legacy/TipoInternacion/';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTipoAltaInternacion () {
				var _url = 'legacy/TipoAltaInternacion/';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTipoPacienteFacturacion () {
				var _url = 'legacy/TipoPacienteFacturacion/';
				return DotService.Get(_url, { isCachable: true });
			}

			function addObservacion (pObservacion) {
				var _url = 'legacy/ObservacionesInternado/';
				return DotService.Post(_url, pObservacion, { isDictionary: true });
			}
		}
	};

	return module;


})();