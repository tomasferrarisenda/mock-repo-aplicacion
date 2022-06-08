import { IDtoService } from "core/http";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('InternacionReportesDataService', InternacionReportesDataService);

		// Inyección de dependencia
		InternacionReportesDataService.$inject = ['DotService', 'Logger'];

		// Definición del servicio
		function InternacionReportesDataService (DotService: IDtoService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternacionReportesDataService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getHistorico: getHistorico,
				getHistoricoLazy : getHistoricoLazy,
				getReporteFlujoCamas : getReporteFlujoCamas,

				getReporteProtesis : getReporteProtesis,
				getCantidadPacienteByFechaProbableRecepcionMateriales : getCantidadPacienteByFechaProbableRecepcionMateriales
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function getHistorico (pUser, pObject) {
				var _url = 'legacy/Internacion/Reportes/Historico/' + false;
				return DotService.Post(_url, pObject, { isDictionary: true });
			}

			function getHistoricoLazy (pUser, pObject) {
				var _url = 'legacy/Internacion/Reportes/Historico/' + true;
				return DotService.Post(_url, pObject, { isDictionary: true });
			}

			function getReporteFlujoCamas (pFechaAdmision) {
				var _url = 'legacy/Internacion/Reportes/FlujoCamas/' + pFechaAdmision;
				return DotService.Get(_url);
			}

			function getReporteProtesis (pFechaProbableRecepcion) {
				var _url = 'legacy/ProtesisPreadmision/Reporte/Estadisticas/Totales/' + pFechaProbableRecepcion;
				return DotService.Get(_url);
			}

			function getCantidadPacienteByFechaProbableRecepcionMateriales (pFechaProbableRecepcion) {
				var _url = 'legacy/ProtesisPreadmision/Reporte/TotalPacientes/' + pFechaProbableRecepcion;
				return DotService.Get(_url);
			}
		}
	};

	return module;

})();