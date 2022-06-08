import { IDtoService } from "core/http";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ReportesCamaDataService', ReportesCamaDataService);

		ReportesCamaDataService.$inject = ['DotService', 'AuthorizationService', 'Logger'];
		
		function ReportesCamaDataService (DotService: IDtoService, AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ReportesCamaDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getReporteOcupacion : getReporteOcupacion
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/**
			 * Reporte de ocupación por categoría de cama
			 * @param  {Dictionary} pData [Contiene sucursal y lista de tipo de habitacion]
			 * @return {List} Lista de categorias
			 */
			function getReporteOcupacion (pData) {
				var _url = 'legacy/Cama/Reporte/Ocupacion/Categoria';
				return DotService.Post(_url, pData, {isDictionary: true});
			}
		}
	};

	return module;

})();