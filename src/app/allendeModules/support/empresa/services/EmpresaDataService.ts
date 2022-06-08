/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('EmpresaDataService', EmpresaDataService);

		EmpresaDataService.$inject = ['DotService', 'Logger'];
		
		function EmpresaDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EmpresaDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				getOneOrganizacionByCuit: getOneOrganizacionByCuit,
				addOneOrganizacion: addOneOrganizacion
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function getOneOrganizacionByCuit (pCuit) {
				var _url = 'Organizacion/ByCuit/' + pCuit;
				return DotService.Get(_url);
			}

			function addOneOrganizacion (pEmpresa) {
				var _url = 'Organizacion/Add';
				return DotService.Post(_url, pEmpresa);
			}
		};
	};

	return module;

})();