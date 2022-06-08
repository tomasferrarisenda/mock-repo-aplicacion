/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('RecursosAuthService', RecursosAuthService);

		RecursosAuthService.$inject = ['AuthorizationService', 'Logger'];
		
		function RecursosAuthService (AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RecursosAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction : resolveAction
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Recursos', pActionName);
			}
		}
	};

	return module;

})();