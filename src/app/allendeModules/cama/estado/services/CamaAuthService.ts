/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CamaAuthService', CamaAuthService);

		CamaAuthService.$inject = ['AuthorizationService', 'Logger', 'ACTION_CAMA', 'PERMISSION_CAMA'];
		
		function CamaAuthService (AuthorizationService, $log, ACTION_CAMA, PERMISSION_CAMA) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CamaAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				validarEsListAll : validarEsListAll,
				selectList : selectList,


				resolveAction: resolveAction,
				resolvePermission : resolvePermission
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Cama-Estados', pActionName);
			}

			function resolvePermission (pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('Cama-Estados', pPermissionName);
			}
			
			function selectList (pUser) {
				return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_CAMA.LIST);
			}

			function validarEsListAll (pActionPath) {
				if(pActionPath == ACTION_CAMA.LIST_ALL) {
					return true;
				} else {
					return false;
				}
			}
		}
	};

	return module;

})();