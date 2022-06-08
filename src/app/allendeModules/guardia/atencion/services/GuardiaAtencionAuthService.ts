export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('GuardiaAtencionAuthService', GuardiaAtencionAuthService);

		GuardiaAtencionAuthService.$inject = ['AuthorizationService', '$log'];

		function GuardiaAtencionAuthService(AuthorizationService, $log) {

			$log.debug('GuardiaAtencionAuthService: ON.-');

			// API o Interface
			const service = {
				resolveAction: resolveAction,
				resolvePermission: resolvePermission
			};

			return service;

			function resolveAction(pActionName) {
				$log.debug("resolveAction", pActionName);
				return AuthorizationService.ResolveActionBySystem('Guardia-Atencion', pActionName);
			}

			function resolvePermission(pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('Guardia-Atencion', pPermissionName);
			}
		}
	};

	return module;
})();