export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('MantenimientoAgendaAuthService', MantenimientoAgendaAuthService);

		// Inyección de dependencia
		MantenimientoAgendaAuthService.$inject = ['AuthorizationService', '$log', 'PERMISSION_FERIADO','PERMISSION_RECESO'];

		// Definición del servicio
		function MantenimientoAgendaAuthService(AuthorizationService, $log, PERMISSION_FERIADO, PERMISSION_RECESO) {

			//$log.debug('MantenimientoAgendaAuthService: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				resolveAction: resolveAction,
				resolvePermission: resolvePermission,

				puedeAgregarFeriado : puedeAgregarFeriado,
				puedeEditarFeriado : puedeEditarFeriado,
				puedeEliminarFeriado : puedeEliminarFeriado,
				puedeAplicarFeriado: puedeAplicarFeriado,

				puedeAgregarReceso : puedeAgregarReceso,
				puedeEditarReceso : puedeEditarReceso,
				puedeEliminarReceso : puedeEliminarReceso,
				puedeAplicarReceso : puedeAplicarReceso,
				puedeVerMotivoDeReceso : puedeVerMotivoDeReceso


			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function resolveAction(pActionName) {
				//$log.debug('MA: ', pActionName);
				return AuthorizationService.ResolveActionBySystem('Turno-MantenimientoAgenda', pActionName);
			}

			function resolvePermission(pPermissionName) {
				//$log.debug('ServicioTurno: ', pPermissionName);
				return AuthorizationService.ResolvePermissionBySystem('ServiciosTurno-home', pPermissionName);
			}



			///FERIADO PUEDE
			function puedeAgregarFeriado(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_FERIADO.NEW);
			}

			function puedeEditarFeriado(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_FERIADO.EDIT);
			}

			function puedeEliminarFeriado(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_FERIADO.DELETE);
			}

			function puedeAplicarFeriado(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_FERIADO.APLICAR);
			}


			//RECESO PUEDE
			function puedeAgregarReceso(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_RECESO.NEW);
			}

			function puedeEditarReceso(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_RECESO.EDIT);
			}

			function puedeEliminarReceso(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_RECESO.DELETE);
			}

			function puedeAplicarReceso(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_RECESO.APLICAR);
			}

			function puedeVerMotivoDeReceso(pUser) {
				// Para no crear un nuevo permiso, si puede CREAR RECESOS podrá ver los MOTIVOS DE RECESO en los listados
				return AuthorizationService.tienePermisoById(pUser, PERMISSION_RECESO.NEW);
			}

					


		}
	};

	return module;
})();