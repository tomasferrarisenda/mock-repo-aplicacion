/**
 * @author 			ppautasso
 * @description 	Auth service para asignacion turno	
 */
export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('AsignacionTurnoAuthService', AsignacionTurnoAuthService);

		AsignacionTurnoAuthService.$inject = ['AuthorizationService', 'SecurityLogicService', 'Logger',
			'PERMISSION_ASIGNACION_TURNOS'
		];

		function AsignacionTurnoAuthService(AuthorizationService, SecurityLogicService, $log,
			PERMISSION
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AsignacionTurnoAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				tienePermisoCallCenter: tienePermisoCallCenter,
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function tienePermisoCallCenter(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.LIST);
			}

		}
	};

	return module;
})();
