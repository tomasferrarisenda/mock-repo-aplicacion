/**
 * @author:			Pablo Pautasso
 * @description:	Logic service para lista de turnos
 * @type:			Service
 **/
export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ListaTurnosLogicService', ListaTurnosLogicService);

		ListaTurnosLogicService.$inject = ['Logger'];
		
		function ListaTurnosLogicService ($log) {

			$log = $log.getInstance('ListaTurnosLogicService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				method : method
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function method () {
			}
			
		}
	};

	return module;
})();