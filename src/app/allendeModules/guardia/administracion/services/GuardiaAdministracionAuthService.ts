export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('GuardiaAdministracionAuthService', GuardiaAdministracionAuthService);

		GuardiaAdministracionAuthService.$inject = ['AuthorizationService','$log']
		
		function GuardiaAdministracionAuthService (AuthorizationService, $log) {

			$log.debug('GuardiaAdministracionAuthService: ON.-');
			
			// API o Interface
			const service = {
				resolveAction :  resolveAction,
				resolvePermission : resolvePermission
			};

			return service;

			function resolveAction (pActionName) {
				$log.debug("resolveAction", pActionName);
				return AuthorizationService.ResolveActionBySystem('Guardia-Administracion', pActionName);
			}

			function resolvePermission (pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('Guardia-Administracion', pPermissionName);
			}
		}
	};

	return module;
})();