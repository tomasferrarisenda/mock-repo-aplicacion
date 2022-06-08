export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('HomologacionesAuthService', HomologacionesAuthService);

		// Inyección de dependencia
		HomologacionesAuthService.$inject = ['AuthorizationService','$log', 'PERMISSION_HOMOLOGACIONES'];

		// Definición del servicio
		function HomologacionesAuthService (AuthorizationService, $log, PERMISSION) {

			//$log.debug('HomologacionesAuthService: ON.-');
			
			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				resolveAction :  resolveAction,
				resolvePermission : resolvePermission,

				puedeEditarHomologacion : puedeEditarHomologacion
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Facturación-Homologaciones', pActionName);
			}

			function resolvePermission (pPermissionName) {
				return AuthorizationService.ResolvePermissionBySystem('ServiciosFacturacion-home', pPermissionName);
			}

			//el permiso edit, puede eliminar, editar y guardar. OK por Jorge
			function puedeEditarHomologacion(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}
		}
	};

	return module;
})();