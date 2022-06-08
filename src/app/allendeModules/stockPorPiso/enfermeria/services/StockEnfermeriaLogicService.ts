import * as angular from 'angular';

import listadoTemplate = require('../views/tabs/stock-tab-listado-enfermeria.html');
import asignacionTemplate = require('../views/tabs/stock-tab-asignacion.html');

import { IStockCommonLogicService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('StockEnfermeriaLogicService', StockEnfermeriaLogicService);

		StockEnfermeriaLogicService.$inject = ['TABS_ENFERMERIA', '$log', 'StockCommonLogicService'];
		function StockEnfermeriaLogicService(TABS_ENFERMERIA, $log, StockCommonLogicService: IStockCommonLogicService) {
			
			$log.info('StockEnfermeriaLogicService: ON.-');

			var veTodosLosPacientes = false;
			var veTodosLosPisos = false;
			var puedeAutorizar = false;

			// API o Interface
			const service = {
				getTabs: getTabs,
				// rellenarDatosMovimientoFarmacia: rellenarDatosMovimientoFarmacia,
				veTodosLosPacientes: getVeTodosLosPacientes,
				veTodosLosPisos: getVeTodosLosPisos,
				puedeAutorizar: getPuedeAutorizar
			};

			function getVeTodosLosPacientes() {
				return this.veTodosLosPacientes;
			}

			function getVeTodosLosPisos() {
				return this.veTodosLosPisos;
			}

			function getPuedeAutorizar() {
				return this.puedeAutorizar;
			}

			function getTabs(pUser) {
				var vm = this;
				vm.veTodosLosPacientes = false;
				vm.veTodosLosPisos = false;
				vm.puedeAutorizar = false;
				$log.debug('pUser', pUser);
				var _tabs: Array<any> = [];
				var TABS = angular.copy(TABS_ENFERMERIA);
				for (var i = 0; i < pUser.permisos.length; i++) {
					switch (pUser.permisos[i].Id) {
						case 123:
						vm.puedeAutorizar = true;
							if (!existeEnArray(_tabs, TABS.LISTADO)) {
								TABS.LISTADO.CONTENT = listadoTemplate;
								_tabs.push(TABS.LISTADO);
							}
							break;
						case 122:
							if (!existeEnArray(_tabs, TABS.LISTADO)) {
								TABS.LISTADO.CONTENT = listadoTemplate;
								_tabs.push(TABS.LISTADO);
							}
							break;
						case 121:
							if (!existeEnArray(_tabs, TABS.LISTADO)) {
								TABS.LISTADO.CONTENT = listadoTemplate;
								_tabs.push(TABS.LISTADO);
							}
							break;
						case 120:
							if (!existeEnArray(_tabs, TABS.ASIGNACION)) {
								TABS.ASIGNACION.CONTENT = asignacionTemplate;
								_tabs.push(TABS.ASIGNACION);
							}
							break;
						case 124:
						vm.veTodosLosPacientes = true;
							if (!existeEnArray(_tabs, TABS.ASIGNACION)) {
								TABS.ASIGNACION.CONTENT = asignacionTemplate;
								_tabs.push(TABS.ASIGNACION);
							}
							break;
						case 125:
						vm.veTodosLosPisos = true;
							if (!existeEnArray(_tabs, TABS.ASIGNACION)) {
								TABS.ASIGNACION.CONTENT = asignacionTemplate;
								_tabs.push(TABS.ASIGNACION);
							}
							break;
					}
				}
				_tabs.sort(function (a, b) {
					return a.order - b.order;
				});
				$log.debug('_tabs', _tabs);
				return _tabs;
			}

			function existeEnArray(pArray, pElement) {
				return StockCommonLogicService.existeEnArray(pArray, pElement);
			}

			return service;
		}
	};

	return module;
})();

