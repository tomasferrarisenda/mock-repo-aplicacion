/**
 * @author 			emansilla
 * @description 	description
 */
import camaListTemplate = require('../templates/cama-list.tpl.html');
import camaStateTemplate = require('../templates/select-state-cama.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CamaLogicService', CamaLogicService);

		CamaLogicService.$inject = ['Logger', '$uibModal', '$q',
			'AuthorizationService', 'CamaDataService', 
			'ACTION_CAMA', 'PERMISSION_CAMA', 'PERMISSION_CAMA_ESTADOS'
		];
		
		function CamaLogicService ($log, $uibModal, $q,
			AuthorizationService, CamaDataService,
			ACTION_CAMA, PERMISSION_CAMA, PERMISSION) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CamaLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				newHistorial : newHistorial,
				getAllByActionAndSucursal : getAllByActionAndSucursal,

				validarEsListAll : validarEsListAll,

				selectList : selectList,

				openHabitaciones : openHabitaciones,
				openStates : openStates
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function newHistorial (pCama, pState, pObservaciones) {
				var _historial : any = {
					id_cama: '',
					observaciones : '',
					id_estado_cama : ''
				};

				if (pCama && pState) {
					_historial.id_cama = pCama.id_cama;
					_historial.id_estado_cama = pState.id_estado_cama;
					if (pObservaciones) {
						_historial.observaciones = pObservaciones;
					}
				} else {
					_historial = null;
				}

				return _historial;
			}

			function getAllByActionAndSucursal (pIdPermiso, pSucursal) {
				switch(pIdPermiso) {
					case PERMISSION.LIST_LIMPIEZA:
						return CamaDataService.getAllLimpiezaBySucursalLazy(pSucursal);
					case PERMISSION.LIST_MANTENIMIENTO:
						return CamaDataService.getAllMantenimientoBySucursalLazy(pSucursal);
					case PERMISSION.LIST_ALL:
						return CamaDataService.getAllLazy();
					default:
						return $q.reject('No existe el permiso');
				}
			}

			function selectList (pUser) {
				return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_CAMA.LIST);
			}

			function validarEsListAll (pActionPath) {
				if(pActionPath == ACTION_CAMA.LIST_ALL) {
					return true;
				} else {
					return false;
				}
			}

			function openHabitaciones (pInternacion, pUser) {
				return $uibModal.open({
					template: camaListTemplate,
					controller: 'CamaListSelectorController',
					controllerAs : 'vm',
					size: 'lg',
					resolve: {
						Internado : function () {
							return pInternacion;
						},
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'Seleccionar una cama';
						},
						Module : Module
					}
				}).result;
			}

			function Module () {
				return 'CAMA';
			}

			function openStates (pScope) {
				return $uibModal.open({
					template: camaStateTemplate,
					scope : pScope
				}).result;
			}
		}
	};

	return module;

})();