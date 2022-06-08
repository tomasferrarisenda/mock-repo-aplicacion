/**
 * @author 			Aldo Minoldo
 * @description 	description
 */
 export default(function() {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('OrganizacionGestionLogicService', OrganizacionGestionLogicService);

		OrganizacionGestionLogicService.$inject = ['Logger'			
		];

		function OrganizacionGestionLogicService($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('OrganizacionGestionLogicService');

			const service = {
			};
			return service;
		}
	};
	return module;
})();