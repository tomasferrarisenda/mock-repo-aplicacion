export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrefacturaInternacionAuthService', PrefacturaInternacionAuthService);

		// Inyección de dependencia
		PrefacturaInternacionAuthService.$inject = ['AuthorizationService','$log'];

		// Definición del servicio
		function PrefacturaInternacionAuthService (AuthorizationService, $log) {

			$log.debug('PrefacturaInternacionAuthService: ON.-');
			
			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				resolveAction :  resolveAction,
				resolvePermission : resolvePermission
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Facturación-Prefactura', pActionName);
			}

			function resolvePermission (pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('ServiciosFacturacion-home', pPermissionName);
			}
		}
	};

	return module;
})();