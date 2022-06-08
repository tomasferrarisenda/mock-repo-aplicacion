/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('InternacionReportesLogicService', InternacionReportesLogicService);

		// Inyección de dependencia
		InternacionReportesLogicService.$inject = ['Logger'];

		// Definición del servicio
		function InternacionReportesLogicService ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternacionReportesLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				crearDictionary : crearDictionary 
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN  ------------------------------------------ */

			function crearDictionary (pSucursales, pMutuales, pDiagnosticos, pTiposAlta,
				pIngresoDesde, pIngresoHasta, pEgresoDesde, pEgresoHasta, pAutorizacionesAgregadasEnAlta) {
				var _object = {};
				_object['Sucursales'] = pSucursales;
				_object['Mutuales'] = pMutuales;
				_object['Diagnosticos'] = pDiagnosticos;
				_object['TiposAltaInternacion'] = pTiposAlta;
				_object['FechaIngresoDesde'] = pIngresoDesde;
				_object['FechaIngresoHasta'] = pIngresoHasta;
				_object['FechaEgresoDesde'] = pEgresoDesde;
				_object['FechaEgresoHasta'] = pEgresoHasta;
				_object['autorizacionesAgregadasEnAlta'] = pAutorizacionesAgregadasEnAlta;
				return _object;
			}
		}
	};

	return module;

})();