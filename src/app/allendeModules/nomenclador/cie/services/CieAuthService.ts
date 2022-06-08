/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CieAuthService', CieAuthService);

		// Inyección de dependencia
		CieAuthService.$inject = ['AuthorizationService','Logger', 'ACTION_NOMENCLADOR_CIE'];

		// Definición del servicio
		function CieAuthService (AuthorizationService, $log, ACTION_NOMENCLADOR_CIE) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CieAuthService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction :  resolveAction,
				resolvePermission : resolvePermission
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('NomencladorCie', pActionName);
			}

			function resolvePermission (pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('NomencladorCie', pPermissionName);
			}
		}
	};

	return module;

})();