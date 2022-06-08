/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('RolesGestionAuthService', RolesGestionAuthService);

		RolesGestionAuthService.$inject = ['AuthorizationService', 'Logger',
		'PERMISSION_ROL'
		];

		function RolesGestionAuthService(AuthorizationService, $log,
			PERMISSION
			) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RolesGestionAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				puedeCrear: puedeCrear,
				puedeEditar: puedeEditar,
				puedeEliminar: puedeEliminar

			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function puedeCrear(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.NEW);
			}

			function puedeEditar(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}

			function puedeEliminar(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.DELETE);
			}


		}
	};

	return module;
})();
