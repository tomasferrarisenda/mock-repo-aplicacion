/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PacienteAuthService', PacienteAuthService);

		PacienteAuthService.$inject = ['AuthorizationService','Logger', 'PERMISSION_PACIENTE','PACIENTE_TABS',
										];
		
		function PacienteAuthService (AuthorizationService, $log, PERMISSION,TABS) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteAuthService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				// resolveAction :  resolveAction,
				// resolvePermission : resolvePermission,
				getTabs : getTabs,
				puedeVerPaciente : puedeVerPaciente,
				puedeAgregarPaciente : puedeAgregarPaciente,
				puedeEditarPaciente: puedeEditarPaciente,
				puedeEliminarPaciente: puedeEliminarPaciente
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			// function resolveAction (pActionName) {
			// 	return AuthorizationService.ResolveActionBySystem('Paciente', pActionName);
			// }

			// function resolvePermission (pPermissionName) {
			// 	return AuthorizationService.ResolvePermissionBySystem('Paciente', pPermissionName);
			// }

			function getTabs (pIdPermiso, pUser) {
				return AuthorizationService.getTabs(pIdPermiso, TABS, '', pUser);
			}

			function puedeAgregarPaciente(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.NEW);
			}

			function puedeEditarPaciente(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}

			function puedeVerPaciente(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.VIEW);
			}

			function puedeEliminarPaciente(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.DELETE);
			}

		
		}
	};

	return module;

})();