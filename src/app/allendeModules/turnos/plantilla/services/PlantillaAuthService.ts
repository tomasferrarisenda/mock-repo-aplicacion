/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('PlantillaAuthService', PlantillaAuthService);

		PlantillaAuthService.$inject = ['AuthorizationService', 'SecurityLogicService', 'Logger',
			'PERMISSION_PLANTILLA'
		];

		function PlantillaAuthService(AuthorizationService, SecurityLogicService, $log,
			PERMISSION
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PlantillaAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				puedeCrear: puedeCrear,
				puedeEditar: puedeEditar,
				puedeAplicar: puedeAplicar,
				puedeEliminar: puedeEliminar,
				puedeVer: puedeVer,
				puedeCopiarPlantilla: puedeCopiarPlantilla,
				puedeEditarObservacionInterna: puedeEditarObservacionInterna,
				puedeEditarObservacionPortal: puedeEditarObservacionPortal,
				puedeListaReglasDuracion: puedeListaReglasDuracion,
				puedeListaReglasCantidad: puedeListaReglasCantidad
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function puedeCrear(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.NEW);
			}

			function puedeEditar(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}

			function puedeAplicar(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.APLICAR);
			}

			function puedeEliminar(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.DELETE);
			}

			function puedeVer(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.VIEW);
			}

			function puedeCopiarPlantilla(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.COPY);
			}

			function puedeEditarObservacionInterna(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT_OBSERVACION_INTERNA);
			}

			function puedeEditarObservacionPortal(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT_OBSERVACION_PORTAL);
			}

			function puedeListaReglasDuracion(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.REGLA_DURACION_TURNOS);
			}

			function puedeListaReglasCantidad(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.REGLA_CANTIDAD_TURNOS);
			}



		}
	};

	return module;
})();