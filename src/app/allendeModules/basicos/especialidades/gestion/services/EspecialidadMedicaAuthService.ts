/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('EspecialidadMedicaAuthService', EspecialidadMedicaAuthService);

		EspecialidadMedicaAuthService.$inject = ['AuthorizationService', 'Logger'];
		
		function EspecialidadMedicaAuthService (AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EspecialidadMedicaAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction : resolveAction
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Servicios-Especialidad', pActionName);
			}
		}
	};

	return module;
})();