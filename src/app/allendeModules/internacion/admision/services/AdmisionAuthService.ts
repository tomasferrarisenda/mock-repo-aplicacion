/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('AdmisionAuthService', AdmisionAuthService);

		AdmisionAuthService.$inject = ['AuthorizationService', 'Logger', 'PrintSelectionService',
			'PERMISSION_ADMISION',
			'ADMISION_TABS', 'PERMISSION_IMPRESION_INTERNADOS'];
		
		function AdmisionAuthService (AuthorizationService, $log, PrintSelectionService, PERMISSION,
			TABS, PRINTS) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AdmisionAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getTabs : getTabs,

				puedeAdmitir : puedeCrear,
				puedeImprimir : puedeImprimir,
				selectPrint : selectPrint
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function getTabs (pIdPermiso, pUser) {
				return AuthorizationService.getTabs(pIdPermiso, TABS, '', pUser);
			}

			function puedeCrear (pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.NEW);
			}

			function puedeImprimir (pUser) {
				var _flag = false;
				if (pUser.Impresiones) {
					return true;
				}
				return _flag;
			}

			function selectPrint (pUser) {
				var permisosIds = AuthorizationService.getIdsPremisosByIdPadre(pUser, PRINTS.ADMISION);
				return PrintSelectionService.open(pUser, permisosIds);
			}
		}
	};

	return module;

})();