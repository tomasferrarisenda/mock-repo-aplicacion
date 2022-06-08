/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('HabitacionGestionAuthService', HabitacionGestionAuthService);

		HabitacionGestionAuthService.$inject = ['AuthorizationService', 'Logger'];
		
		function HabitacionGestionAuthService (AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('HabitacionGestionAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction : resolveAction
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Cama-Gestion', pActionName);
			}
		}
	};

	return module;

})();