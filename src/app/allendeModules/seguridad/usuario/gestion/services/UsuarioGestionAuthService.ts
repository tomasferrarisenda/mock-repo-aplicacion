/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('UsuarioGestionAuthService', UsuarioGestionAuthService);

		UsuarioGestionAuthService.$inject = ['AuthorizationService', 'SecurityLogicService', 'Logger',
			'PERMISSION_USUARIO', 'PERMISSION_LIST_USUARIOS'
		];

		function UsuarioGestionAuthService(AuthorizationService, SecurityLogicService, $log,
			PERMISSION, PERMISSION_LIST
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UsuarioGestionAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				puedeCrear: puedeCrear,
				puedeEditar: puedeEditar,
				puedeVer: puedeVer,
				puedeEliminar: puedeEliminar,
				puedeAsignarRol: puedeAsignarRol,
				selectAsignar: selectAsignar

			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function puedeCrear(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.NEW);
			}

			function puedeEditar(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}

			function puedeVer(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.VIEW);
			}

			function puedeEliminar(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.DELETE);
			}

			function puedeAsignarRol(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.ASIGNAR_USUARIO);
			}

			function selectAsignar(pUser) {
				return SecurityLogicService.OpenActionSelectorByPermission(pUser, PERMISSION.ASIGNAR_USUARIO,
					PERMISSION_LIST);
			}


		}
	};

	return module;
})();
