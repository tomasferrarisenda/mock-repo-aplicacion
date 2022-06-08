export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrefacturaInternacionListAuthService', PrefacturaInternacionListAuthService);

		// Inyección de dependencia
		PrefacturaInternacionListAuthService.$inject = ['AuthorizationInternacionService','$log'];

		// Definición del servicio
		function PrefacturaInternacionListAuthService (AuthorizationService, $log) {

			$log.debug('PrefacturaInternacionListAuthService: ON.-');
			
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