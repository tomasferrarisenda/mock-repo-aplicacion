/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import servicioNewTemplate = require('../templates/servicio-new.tpl.html');
import servicioEditTemplate = require('../templates/servicio-edit.tpl.html');
import buscadorServicioMedicoTemplate = require('../templates/buscador-servicio-medico.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('ServiciosGestionLogicService', ServiciosGestionLogicService);

		ServiciosGestionLogicService.$inject = ['Logger', '$uibModal', 'TABS_SERVICIOS'];

		function ServiciosGestionLogicService($log, $uibModal, TABS_SERVICIOS) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServiciosGestionLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var IdServicio = 0;
			var NombreServicio = '';
			var IdScurusal = 0;
			var NombreSucursal = '';

			const service = {

				//validarEsListAll: validarEsListAll,

				getTabs: getTabs,
				nextTab : nextTab,
				previousTab : previousTab,

				selectList: selectList,
				openServicio: openServicio,
				newServicio: newServicio,
				editServicio: editServicio,
				elegirSucursal: elegirSucursal,

				openBuscadorServicio: openBuscadorServicio

			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function selectList(pUser) {
				//return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_SERVICIOS.LIST)
			}

			// function validarEsListAll(pActionPath) {
			// 	if (pActionPath == ACTION_SERVICIOS_GESTION.LIST_ALL) {
			// 		return true;
			// 	} else {
			// 		return false;
			// 	}
			// }


			function Module() {
				return 'SERVICIOS';
			}

			function getTabs () {
				var _tabsReturn : Array<any> = [],
					TABScopy : Array<any> = [];

				
				TABScopy = angular.copy(TABS_SERVICIOS);
				
				angular.forEach(TABScopy, function(value, index){

				
					TABScopy[index].ID =  index + 1;
					TABScopy[index].CONTENT = TABScopy[index].CONTENT;
					_tabsReturn.push(TABScopy[index]);


				});

		
				$log.debug('_tabsReturn: ', _tabsReturn);

				return _tabsReturn;
			}

			function nextTab (pID, pTabs) {

				var _count = pTabs.length,
					_idNext = pID + 1;

				$log.debug('Next Tab: ', _idNext, pTabs);

				for (var i = 0; i < _count; i++) {
					if (_idNext <= _count) {
						if (pTabs[i].ID == _idNext) {
							if (pTabs[i].hide) {
								_idNext ++;
							}
							else {
								pTabs[i].ACTIVE = true;
							}
						} else {
							pTabs[i].ACTIVE = false;
						}
					}
				}
			}

			function previousTab (pID, pTabs) {

				var _count = pTabs.length,
					_idAnt = pID - 1;
					
				if (_idAnt > 0) {
					for (var i = 0; i < _count; i++) {
						if (pTabs[i].ID == _idAnt) {
							pTabs[i].ACTIVE = true;
						} else {
							pTabs[i].ACTIVE = false;
						}
					}
				}
			}




			function openServicio(pIdServicio) {
				$log.debug('openServiciosModal OK.-', pIdServicio);
				// var _idServicioSelected;
				// if (pIdServicio)
				// 	_idServicioSelected = pIdServicio;
				// else
				// 	_idServicioSelected = null;

				// return $uibModal.open({
				// 	templateUrl: 'basicos/servicios/gestion/templates/servicio-view.tpl.html',
				// 	controller: 'ServicioViewController',
				// 	controllerAs: 'vm',
				// 	size: 'lg',
				// 	resolve: {
				// 		IdServicioSelected: function() {
				// 			return _idServicioSelected;
				// 		},
				// 		// User: function () {
				// 		// 	return pUser;
				// 		// },
				// 		Title: function() {
				// 			return 'Seleccionar un servicio';
				// 		},
				// 		Module: Module
				// 	}

				// }).result;
			}


			function newServicio(pUser) {
				$log.debug('newServicio OK.-');

				return $uibModal.open({
					template: servicioNewTemplate,
					controller: 'ServicioNewController',
					controllerAs: 'vm',
					keyboard : true,
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Agregar un servicio';
						},
						Module: Module
					}

				}).result;

			}

			function editServicio(pIdServicioSelected) {

				$log.debug('editServicio OK.-', pIdServicioSelected);
				var _idServicioSelected;
				if (pIdServicioSelected)
					_idServicioSelected = pIdServicioSelected;
				else
					_idServicioSelected = null;

				return $uibModal.open({
					template: servicioEditTemplate,
					controller: 'ServicioEditController',
					controllerAs: 'vm',
					keyboard : true,
					size: 'md',
					resolve: {
						IdServicioSelected: function() {
							return _idServicioSelected;
						},
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Seleccionar una cama';
						},
						Module: Module
					}

				}).result;
			}

			function elegirSucursal() {
				$log.debug('elegirSucursal OK.-');

				// return $uibModal.open({
				// 	templateUrl: 'basicos/servicios/gestion/templates/servicio-getSucursales.tpl.html',
				// 	controller: 'ServicioGetSucursalesController',
				// 	controllerAs: 'vm',
				// 	size: 'lg',
				// 	resolve: {
				// 		// User: function () {
				// 		// 	return pUser;
				// 		// },
				// 		Title: function() {
				// 			return 'Elegir una sucursal';
				// 		},
				// 		Module: Module
				// 	}

				// }).result;

			}


			function openBuscadorServicio() {

				return $uibModal.open({
					template: buscadorServicioMedicoTemplate,
					controller: 'BuscadorServicioMedicoController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						

					}
				}).result;
				

			}


		}
	};

	return module;

})();