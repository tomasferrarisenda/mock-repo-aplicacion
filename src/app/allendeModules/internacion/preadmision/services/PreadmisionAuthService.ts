/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PreadmisionAuthService', PreadmisionAuthService);

		PreadmisionAuthService.$inject = ['AuthorizationService', 'Logger', 'SecurityLogicService', 'PrintSelectionService',
			'ESTADO_SOLICITUD', 'PERMISSION_PREADMISION', 
			'PERMISSION_LIST_PREADMISION', 'PREADMISION_TABS', 'PERMISSION_IMPRESION_INTERNADOS'];
		
		function PreadmisionAuthService (AuthorizationService, $log, SecurityLogicService, PrintSelectionService,
			ESTADO_SOLICITUD, PERMISSION, PERMISSION_LIST, TABS, PRINTS) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				// Permisos

				puedeCrear : puedeCrear,
				puedeAnular : puedeAnular,
				puedeEditar : puedeEditar,
				puedeEditarLazy : puedeEditarLazy,
				puedeImprimir : puedeImprimir,

				puedeReadmitir: puedeReadmitir,

				openNewSelector : openNewSelector,
				openEditSelector : openEditSelector,
				openEditSelectorLazy : openEditSelectorLazy,
				selectDelete : selectDelete,
				selectPrint : selectPrint,

				getTabs : getTabs,

			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getTabs (pIdPermiso, pUser) {
				$log.debug('GetTabs: ON', pUser, pIdPermiso);
				return AuthorizationService.getTabs(pIdPermiso, TABS, '', pUser);
			}

			function puedeCrear (pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.NEW);
			}

			function puedeImprimir (pUser, pNombreEstadoPreadmision) {
				var _flag = false;
				if (pUser.impresiones && pNombreEstadoPreadmision != ESTADO_SOLICITUD.ANULADO) {
					return true;
				} 
				return _flag;
			}

			function puedeAnular (pUser, pNombreEstadoSolicitud) {
				var _flag = false;
				if (AuthorizationService.tienePermisoById(pUser, PERMISSION.DELETE)) {
					if (pNombreEstadoSolicitud == ESTADO_SOLICITUD.CREADO) {
						_flag = true;
					}
				}

				return _flag;
			}

			function puedeEditar (pUser, pSolicitud, pLazy) {
				var _flag = true;
				var pNombreEstadoSolicitud = 
					(pLazy) ? pSolicitud.nombre_estado_preadmision : pSolicitud.EstadoPreadmision.nombre_estado_preadmision;

				switch(pNombreEstadoSolicitud) {
					case ESTADO_SOLICITUD.ANULADO:
						_flag = false;
						break;
					case ESTADO_SOLICITUD.CREADO:
						_flag = AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT_CREATED);
						break;
					case ESTADO_SOLICITUD.EN_PROCESO:
						_flag = validarEstadoEnProceso(pUser);
						break;
					case ESTADO_SOLICITUD.PENDIENTE:
						_flag = AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT_PENDING);
						break;
					case ESTADO_SOLICITUD.EN_CIRUGIA:
						if (pSolicitud.TipoInternacion && pSolicitud.TipoInternacion.EsQuirurgica) {
							_flag = AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT_APRROVED);
						} else {
							_flag = false;
						}
						break;
					case ESTADO_SOLICITUD.NO_CONFORMIDAD:
						_flag = AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT_UNCONFORMITY);
						break;
				}

				return _flag;
			}

			function puedeEditarLazy (pUser, pSolicitud) {
				return puedeEditar(pUser, pSolicitud, true);
			}

			function openNewSelector (pUser) {
				return SecurityLogicService.OpenActionSelectorByPermission(pUser, PERMISSION.NEW, PERMISSION_LIST);
			}

			function openEditSelectorLazy (pUser, pSolicitud) {
				return openEditSelector (pUser, pSolicitud, true);
			}

			function openEditSelector (pUser, pSolicitud, pLazy) {
				var editByStatus;
				var pNombreEstadoSolicitud = 
					(pLazy) ? pSolicitud.nombre_estado_preadmision : pSolicitud.EstadoPreadmision.nombre_estado_preadmision;

				switch (pNombreEstadoSolicitud) {
					case ESTADO_SOLICITUD.ANULADO:
						editByStatus = PERMISSION.EDIT_NULL;
						break;
					case ESTADO_SOLICITUD.CREADO:
						editByStatus = PERMISSION.EDIT_CREATED;
						break;
					case ESTADO_SOLICITUD.EN_PROCESO:
						editByStatus = PERMISSION.EDIT_IN_PROCESS;
						break;
					case ESTADO_SOLICITUD.PENDIENTE:
						editByStatus = PERMISSION.EDIT_PENDING;
						break;
					case ESTADO_SOLICITUD.EN_CIRUGIA:
						editByStatus = PERMISSION.EDIT_APRROVED;
						break;
					case ESTADO_SOLICITUD.NO_CONFORMIDAD:
						editByStatus = PERMISSION.EDIT_UNCONFORMITY;
						break;
				}

				return SecurityLogicService.OpenActionSelectorByPermission(pUser, editByStatus, PERMISSION_LIST);
			}

			function selectDelete (pUser) {
				return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION.DELETE);
			}

			function selectPrint (pUser) {
				var permisosIds = AuthorizationService.getIdsPremisosByIdPadre(pUser, PRINTS.PREADMISION);
				return PrintSelectionService.open(pUser, permisosIds);
			}

			function validarEstadoEnProceso (pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.EDIT_IN_PROCESS);
			}

			function puedeReadmitir(pUser) {
				return AuthorizationService.tienePermisoById(pUser, PERMISSION.READMITIR);
			}
		}
	};

	return module;

})();