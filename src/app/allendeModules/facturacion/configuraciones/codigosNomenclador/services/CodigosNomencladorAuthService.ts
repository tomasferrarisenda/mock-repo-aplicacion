export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CodigosNomencladorAuthService', CodigosNomencladorAuthService);

		CodigosNomencladorAuthService.$inject = ['AuthorizationService','$log','PERMISSION_CONFIGURACIONES'];

		function CodigosNomencladorAuthService (AuthorizationService, $log, PERMISSION) {

			const service = {
				resolveAction :  resolveAction,
				resolvePermission : resolvePermission,
				puedeEditarCodigoNomenclador : puedeEditarCodigoNomenclador
			};

			return service;

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Facturación-Configuraciones', pActionName);
			}

			function resolvePermission (pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('ServiciosFacturacion-home', pPermissionName);
			}

			function puedeEditarCodigoNomenclador(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.LIST);
			}

		}
	};

	return module;
})();