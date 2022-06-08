/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('EvolucionAuthService', EvolucionAuthService);

		// Inyección de dependencia
		EvolucionAuthService.$inject = ['AuthorizationService','Logger', 'ACTION_NOMBRE_MODULE'];

		// Definición del servicio
		function EvolucionAuthService (AuthorizationService, $log, ACTION_NOMBRE_MODULE) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EvolucionAuthService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction :  resolveAction,
				resolvePermission : resolvePermission
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('NombreSistema', pActionName);
			}

			function resolvePermission (pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('NombreSistema', pPermissionName);
			}
		}
	};

	return module;
})();