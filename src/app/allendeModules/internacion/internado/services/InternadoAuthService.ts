/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('InternadoAuthService', InternadoAuthService);

		InternadoAuthService.$inject = ['AuthorizationService', 'Logger', 'PrintSelectionService',
			'PERMISSION_INTERNADO', 'INTERNADO_TABS', 'PERMISSION_IMPRESION_INTERNADOS'];
		
		function InternadoAuthService (AuthorizationService, $log, PrintSelectionService,
			PERMISSION, TABS, PRINTS) {

			$log = $log.getInstance('InternadoAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getTabs : getTabs,
				puedeEditar : puedeEditar,
				puedeAnular : puedeAnular,
				puedeRevertir: puedeRevertir,
				puedeImprimir : puedeImprimir,
				selectPrint : selectPrint,
				puedeLevantarAlta : puedeLevantarAlta
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getTabs (pIdPermiso, pUser) {
				$log.debug('GetTabs: ON', pUser, pIdPermiso);
				return AuthorizationService.getTabs(pIdPermiso, TABS, 'internacion/', pUser);
			}

			function puedeEditar (pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT);
			}

			function puedeAnular(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.ANULAR);
			}

			function puedeRevertir(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.REVERT);
			}
			
			function puedeImprimir (pUser) {
				return true;
				// return AuthorizationService.tienePermisoById(pUser, PERMISSION.PRINT);
			}

			function puedeLevantarAlta (pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.LEVANTAR_ALTA);
			}

			function selectPrint (pUser) {
				var permisosIds = AuthorizationService.getIdsPremisosByIdPadre(pUser, PRINTS.INTERNADO);
				return PrintSelectionService.open(pUser, permisosIds);
			}
		}
	};

	return module;

})();