import * as angular from 'angular';
import ajusteTemplate = require('../views/tabs/stock-tab-ajuste.html');
import facturacionTemplate = require('../views/tabs/stock-tab-facturacion.html');
import informeTemplate = require('../views/tabs/stock-tab-informe.html');
import listadoTemplate = require('../views/tabs/stock-tab-listado-farmacia.html');
import reposicionTemplate = require('../views/tabs/stock-tab-reposicion.html');
import validacionTemplate = require('../views/tabs/stock-tab-validacion.html');
import quirofanoTemplate = require('../views/tabs/stock-tab-quirofano.html');
import repoQuirofanoTemplate = require('../views/tabs/stock-tab-repo-quirofano.html');

import { IStockCommonLogicService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('StockFarmaciaLogicService', StockFarmaciaLogicService);

		StockFarmaciaLogicService.$inject = ['TABS_FARMACIA', '$log', 'StockCommonLogicService'];
		function StockFarmaciaLogicService(TABS_FARMACIA, $log, StockCommonLogicService: IStockCommonLogicService) {
			
			$log.info('StockFarmaciaLogicService: ON.-');

			var supervisor = false;
			var enfermeria = false;

			// API o Interface
			const service = {
				supervisor: getSupervisor,
				enfermeria: getEnfermeria,
				getTabs: getTabs,
				// rellenarDatosMovimientoFarmacia: rellenarDatosMovimientoFarmacia
			};

			function getSupervisor() {
				return supervisor;
			}

			function getEnfermeria() {
				return enfermeria;
			}

			function getTabs(pUser) {
				supervisor = false;
				enfermeria = false;
				$log.debug('pUser', pUser);
				var _tabs: Array<any> = [];
				var TABS = angular.copy(TABS_FARMACIA);
				for (var i = 0; i < pUser.permisos.length; i++) {
					switch (pUser.permisos[i].Id) {
						case 113:
							if (!existeEnArray(_tabs, TABS.REPOSICION)) {
								TABS.REPOSICION.CONTENT = reposicionTemplate;
								_tabs.push(TABS.REPOSICION);
							}
							break;
						case 114:
							if (!existeEnArray(_tabs, TABS.LISTADO)) {
								TABS.LISTADO.CONTENT = listadoTemplate;
								_tabs.push(TABS.LISTADO);
							}
							break;
						case 115:
							supervisor = true;
							if (!existeEnArray(_tabs, TABS.AJUSTE)) {
								TABS.AJUSTE.CONTENT = ajusteTemplate;
								_tabs.push(TABS.AJUSTE);
							}
							break;
						case 116:
							if (!existeEnArray(_tabs, TABS.VALIDACION)) {
								TABS.VALIDACION.CONTENT = validacionTemplate;
								_tabs.push(TABS.VALIDACION);
							}
							break;
						case 117:
							if (!existeEnArray(_tabs, TABS.FACTURACION)) {
								TABS.FACTURACION.CONTENT = facturacionTemplate;
								_tabs.push(TABS.FACTURACION);
							}
							break;
						case 118:
							if (!existeEnArray(_tabs, TABS.FACTURACION)) {
								TABS.FACTURACION.CONTENT = facturacionTemplate;
								_tabs.push(TABS.FACTURACION);
							}
							break;
						case 119:
							if (!existeEnArray(_tabs, TABS.INFORME)) {
								TABS.INFORME.CONTENT = informeTemplate;
								_tabs.push(TABS.INFORME);
							}
							break;
						case 227:
							enfermeria = true;
							if (!existeEnArray(_tabs, TABS.FACTURACION)) {
								TABS.FACTURACION.CONTENT = facturacionTemplate;
								_tabs.push(TABS.FACTURACION);
							}
							break;

						case 218:
							if (!existeEnArray(_tabs, TABS.QUIROFANO)) {
								TABS.QUIROFANO.CONTENT = quirofanoTemplate;
								_tabs.push(TABS.QUIROFANO);
							}
							break;
						case 219:
							if (!existeEnArray(_tabs, TABS.REPO_QUIROFANO)) {
								TABS.REPO_QUIROFANO.CONTENT = repoQuirofanoTemplate;
								_tabs.push(TABS.REPO_QUIROFANO);
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
				return StockCommonLogicService.existeEnArray(pArray,pElement);
			}

			// function rellenarDatosMovimientoFarmacia(pMovimientos, pUbicaciones) {
			// 	MaterialDataService.getAllMateriales()
			// 		.then(function (_materiales) {
			// 			if(pMovimientos != '')
			// 				{	
			// 				for (var i = 0; i < pMovimientos.length; i++) 
			// 				{
			// 					pMovimientos[i].total = 0;
			// 					MovimientoStockDataService.getMovimientoDetalleComprimidoPorMovimiento(pMovimientos[i].id_movimiento)
			// 					.then(function (pDetalle) {
			// 						pMovimientos[i].DetallesMovimiento = pDetalle;
			// 						for (var j = 0; j < pMovimientos[i].DetallesMovimiento.length; j++) {
			// 							pMovimientos[i].total += pMovimiento.DetallesMovimiento[i].cantidad_productos;
			// 							for (var k = 0; k < _materiales.length; k++) {
			// 								if(_materiales[k].id_producto == pMovimientos.DetallesMovimiento[j].id_producto)
			// 								{
			// 									pMovimientos.DetallesMovimiento[j].Producto = _materiales[k];
			// 								}
			// 							}
			// 							pMovimientos[i].DetallesMovimiento[j]
			// 						}
			// 					},function (pError) {
			// 					})
			// 					var _fecha = new Date(pMovimientos[i].fecha_alta);
			// 					_fecha.setHours(0);
			// 					_fecha.setMinutes(0);
			// 					_fecha.setSeconds(0);
			// 					_fecha.setMilliseconds(0);

			// 					pMovimientos[i].fecha = _fecha;
			// 					for (var j = 0; j < pUbicaciones.length; j++) 
			// 					{
			// 						if(pUbicaciones[j].id_ubicacion == pMovimientos[i].id_ubicacion_hasta)
			// 						{
			// 							pMovimientos[i].UbicacionHasta = {};
			// 							pMovimientos[i].UbicacionHasta.nombre = pUbicaciones[j].nombre_ubicacion_piso;
			// 						} 
			// 					}
			// 				}
			// 				$log.debug('FarmaciaListController: rellenarDatosMovimientos OK.-');
			// 			}
			// 		},function (pError) {
			// 		})

			// 	return pMovimientos;
			// }

			

			return service;
		}
	};

	return module;
})();

