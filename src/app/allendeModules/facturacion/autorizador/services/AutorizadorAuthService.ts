export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('AutorizadorAuthService', AutorizadorAuthService);

		// Inyección de dependencia
		AutorizadorAuthService.$inject = ['AuthorizationService','$log','PERMISSION_AUTORIZADORES'];

		// Definición del servicio
		function AutorizadorAuthService (AuthorizationService, $log, PERMISSION) {

			//$log.debug('AutorizadorAuthService: ON.-');
			
			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				resolveAction :  resolveAction,
				resolvePermission : resolvePermission,

				puedeEditarExcepcion: puedeEditarExcepcion,
				puedeEliminarItemAutorizacion : puedeEliminarItemAutorizacion
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function resolveAction (pActionName) {
				//$log.debug('AUTORIZACIONES: ', pActionName);
				return AuthorizationService.ResolveActionBySystem('Facturación-Autorizador', pActionName);
			}

			function resolvePermission (pPermissionName) {
				//$log.debug('AUTORIZACIONES-PERMISO: ', pPermissionName);
				return AuthorizationService.ResolvePermissionBySystem('ServiciosFacturacion-home', pPermissionName);
			}


			//el permiso edit, puede eliminar, editar y guardar. OK por Jorge
			function puedeEditarExcepcion(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}

			//el permiso edit, puede eliminar, editar y guardar. OK por Jorge
			function puedeEliminarItemAutorizacion(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.DELETE_ITEM);
			}

		}
	};

	return module;
})();