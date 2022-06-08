/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('InternacionReportesAuthService', InternacionReportesAuthService);

		// Inyección de dependencia
		InternacionReportesAuthService.$inject = ['AuthorizationService','Logger'];

		// Definición del servicio
		function InternacionReportesAuthService (AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternacionReportesAuthService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction :  resolveAction,
				resolvePermission : resolvePermission
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Admision-Reportes', pActionName);
			}

			function resolvePermission (pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('Admision-Reportes', pPermissionName);
			}
		}
	};

	return module;

})();