/**
 * @author:			Pablo Pautasso
 * @description:	Data service para cancelacion de turnos y reprogramacion
 * @type:			Service
 **/
export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ReprogramacionTurnosDataService', ReprogramacionTurnosDataService);

		ReprogramacionTurnosDataService.$inject = ['DotService', 'Logger']
		
		function ReprogramacionTurnosDataService (DotService, $log) {

			$log = $log.getInstance('ReprogramacionTurnosDataService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				GetAll : GetAll,
				obtenerTurnosAfectados : obtenerTurnosAfectados,
				obtenerTurnosAfectadosConGrilla : obtenerTurnosAfectadosConGrilla
			
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			
			function GetAll () {
				var _url = 'CancelacionesDeTurnos/';
				return DotService.Get(_url);
			}

			function obtenerTurnosAfectados(pId, pIdTipoProceso) {
				var _url = 'CancelacionesDeTurnos/ObtenerTurnosAfectados/' + pId + '/' + pIdTipoProceso;
				return DotService.Get(_url);
			}

			function obtenerTurnosAfectadosConGrilla(pId, pIdTipoProceso,pCurrentPage,pPageSize) {
				var _url = 'CancelacionesDeTurnos/ObtenerTurnosAfectadosGrilla/' + pId + '/' + pIdTipoProceso + '/' + 
				pCurrentPage + '/' + pPageSize;
				return DotService.Get(_url);
			}

			
		}
	};

	return module;
})();