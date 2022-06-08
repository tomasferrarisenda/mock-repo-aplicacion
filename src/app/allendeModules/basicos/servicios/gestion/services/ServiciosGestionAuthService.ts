/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ServiciosGestionAuthService', ServiciosGestionAuthService);

		ServiciosGestionAuthService.$inject = ['AuthorizationService', 'Logger', 'PERMISSION_SERVICIO'];
		
		function ServiciosGestionAuthService (AuthorizationService, $log, PERMISSION) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServiciosGestionAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction : resolveAction,

				puedeVerServicio : puedeVerServicio,
				puedeAgregarServicio : puedeAgregarServicio,
				puedeEditarServicio: puedeEditarServicio,
				puedeEliminarServicio: puedeEliminarServicio,
				puedeAsignarServicio : puedeAsignarServicio


			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('ServicioMedico-Gestion', pActionName);
			}

			function puedeAgregarServicio(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.NEW);
			}

			function puedeEditarServicio(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}

			function puedeVerServicio(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.VIEW);
			}

			function puedeEliminarServicio(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.DELETE);
			}

			function puedeAsignarServicio(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.ASIGNAR);
			}


		}
	};

	return module;

})();