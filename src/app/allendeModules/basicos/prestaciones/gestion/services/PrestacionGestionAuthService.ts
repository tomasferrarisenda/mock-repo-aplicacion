/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrestacionGestionAuthService', PrestacionGestionAuthService);

		PrestacionGestionAuthService.$inject = ['AuthorizationService', 'Logger', 'PERMISSION_PRESTACION'];
		
		function PrestacionGestionAuthService (AuthorizationService, $log, PERMISSION) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrestacionGestionAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				resolveAction : resolveAction,

				puedeVerPrestacion: puedeVerPrestacion,
				puedeAgregarPrestacion: puedeAgregarPrestacion,
				puedeEditarPrestacion: puedeEditarPrestacion,
				puedeEliminarPrestacion: puedeEliminarPrestacion

			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function resolveAction (pActionName) {
				return AuthorizationService.ResolveActionBySystem('Prestacion-Gestion', pActionName);
			}


			function puedeVerPrestacion(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.VIEW);
			}

			function puedeAgregarPrestacion(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.ADD);
			}

			function puedeEditarPrestacion(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}

			function puedeEliminarPrestacion(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.DELETE);
			}

		



		}
	};

	return module;

})();