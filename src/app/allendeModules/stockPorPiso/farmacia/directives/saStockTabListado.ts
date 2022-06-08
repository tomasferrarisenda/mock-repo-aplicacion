/**
 * @author:			Martin Astore
 * @description:	Pestaña Reposicon de Farmacia
 * @type:			Directive
 **/
import template = require('../templates/sa-stock-tab-listado.tpl.html');
import { IMovimientoStockDataService, IStockCommonDataService, IStockCommonLogicService } from '../../common/services';
import { IStockFarmaciaModalService } from '../services';
export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saStockTabListado', saStockTabListado);

		saStockTabListado.$inject = ['$log', '$filter',
			'MovimientoStockDataService', 'StockCommonDataService',
			'StockFarmaciaModalService', 'StockCommonLogicService',
			'StockFarmaciaLogicService'];
		function saStockTabListado($log, $filter,
			MovimientoStockDataService: IMovimientoStockDataService, StockCommonDataService: IStockCommonDataService,
			StockFarmaciaModalService: IStockFarmaciaModalService, StockCommonLogicService: IStockCommonLogicService,
			StockFarmaciaLogicService) {

			return {
				restrict: 'E',
				scope: {
					title: '@?',
					print: '=',
					activate: '<'
				},
				template: template,
				link: link
			};

			function link(scope) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */
				scope.today = new Date();
				
				scope.data = {
					movimientos: [],
					fecha_desde: {},
					fecha_hasta: {},
					farmacia: {},
					materiales: [],
					ubicacionesPiso: [],
					usuarios: [],
					sucursales: []
				};

				scope.formData = {
					fecha_desde: {},
					fecha_hasta: {},
					sucursal: {}
				};

				scope.formControl = {
					loading: false,
					error: true,
					limpiar: false
				};

				// scope.limpiar = limpiar;
				scope.getMovimientos = getMovimientos;
				scope.pageChanged = pageChanged;
				scope.verDetalle = verDetalle;
				scope.printMovimiento = printMovimiento;
				scope.printInternado = printInternado;
				scope.filterDescartable = filterDescartable;
				scope.ubicacionChanged = ubicacionChanged;
				scope.cambiaSucursal = cambiaSucursal;

				scope.paginacion = {
					currentPage: 0
				};
				scope.filter = {
					movimientosDescartable: [],
					movimientos: [],
					usuario: '',
					id_ubicacion_hasta: '',
					material: '',

					// mètodo para botòn Limpiar filtros
					clean: function () {
						scope.filter.usuario = '';
						scope.filter.id_ubicacion_hasta = '';
						scope.filter.material = '';
						scope.formControl.limpiar = true;
						// scope.formData.search = ''

						pageChanged();
					},
					// mètodo para que no valle el filtro de solicitudes
					validar: function () {

						if (scope.filter.usuario == null) {
							scope.filter.usuario = '';
						}
						if (scope.filter.id_ubicacion_hasta == null) {
							scope.filter.id_ubicacion_hasta = '';
						}
						if (scope.filter.material == null) {
							scope.filter.material = '';
						}
					}
				};

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function filterDescartable() {
					$log.debug('FarmaciaController: filterDescartable ON.-');
					if (scope.filter.material.id_producto != '' && scope.filter.material.id_producto != null) {
						scope.filter.movimientosDescartable = [];
						var movimientoOK = false;
						for (var i = scope.data.movimientos.length - 1; i >= 0; i--) {
							movimientoOK = false;
							$log.debug("scope.data.movimientos[i]", scope.data.movimientos[i]);
							for (var j = scope.data.movimientos[i].DetallesMovimiento.length - 1; j >= 0; j--) {
								if (!movimientoOK && scope.data.movimientos[i].DetallesMovimiento[j].id_producto ==
									scope.filter.material.id_producto) {
									scope.filter.movimientosDescartable.push(scope.data.movimientos[i]);
									movimientoOK = true;
								}
							}
						}
					}
					else {
						scope.filter.movimientosDescartable = scope.data.movimientos;
					}
					getPage();
				}

				function getPage() {
					$log.debug('Get Page ON');
					var begin = ((scope.paginacion.currentPage - 1) * scope.paginacion.pageSize);
					var end = begin + scope.paginacion.pageSize;
					scope.filter.validar();
					scope.filter.movimientos = $filter('filter')
						(scope.filter.movimientosDescartable, {
							id_usuario_alta: scope.filter.usuario.Id,
							id_ubicacion_hasta: scope.filter.id_ubicacion_hasta
						});
					$log.debug('filtro ', scope.filter.movimientos);
					scope.paginacion.totalItems = scope.filter.movimientos.length;
					scope.filter.movimientos = scope.filter.movimientos.slice(begin, end);
				}

				function pageChanged() {
					filterDescartable();
				}

				function getMovimientos() {
					$log.debug('FarmaciaController: getMovimientos ON.-');
					scope.formControl.loading = true;

					scope.formData.fecha_hasta = StockCommonLogicService
						.getFechaHastaByDesde(scope.formData.fecha_desde, scope.formData.fecha_hasta);

					scope.data.fecha_desde = $filter('date')(scope.formData.fecha_desde, 'MM/dd/yyyy');
					scope.data.fecha_hasta = $filter('date')(scope.formData.fecha_hasta, 'MM/dd/yyyy');
					var _object = {};
					_object['id_ubicacion'] = scope.data.farmacia.Ubicacion.id_ubicacion;
					_object['fecha_desde'] = scope.data.fecha_desde;
					_object['fecha_hasta'] = scope.data.fecha_hasta;
					MovimientoStockDataService.getMovimientosByUbicacionDesdeAndFechas(_object)
						.then(function (movimientos) {
							scope.data.movimientos = movimientos;
							rellenarDatosMovimientos();
							filterDescartable();
							if (StockFarmaciaLogicService.print) {
								// scope.filter.id_ubicacion_hasta = StockFarmaciaLogicService.ubicacion.id_ubicacion;
								// pageChanged();
								printMovimiento(scope.filter.movimientosDescartable[0]);
								StockFarmaciaLogicService.print = false;
							}
							scope.formControl.error = false;
							scope.formControl.loading = false;
							$log.debug('FarmaciaController: getMovimientos OK.-');
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function rellenarDatosMovimientos() {
					$log.debug('FarmaciaController: rellenarDatosMovimientos ON.-');
					var existe;
					scope.data.usuarios = [];
					if (scope.data.movimientos != '') {
						for (var i = 0; i < scope.data.movimientos.length; i++) {
							// var _fecha = new Date(scope.data.movimientos[i].fecha_hora);
							// _fecha.setHours(0);
							// _fecha.setMinutes(0);
							// _fecha.setSeconds(0);
							// _fecha.setMilliseconds(0);
							// scope.data.movimientos[i].fecha = _fecha;

							for (var j = 0; j < scope.data.ubicacionesPiso.length; j++) {
								if (scope.data.ubicacionesPiso[j].id_ubicacion == scope.data.movimientos[i].id_ubicacion_hasta) {
									scope.data.movimientos[i].UbicacionHasta = {};
									scope.data.movimientos[i].UbicacionHasta.nombre = scope.data.ubicacionesPiso[j].nombre_ubicacion_piso;
								}
							}
							if (scope.data.movimientos[i].id_estado_movimiento == 48) {
								scope.data.movimientos[i].tipo_movimiento = "Reposicion";
							}
							else if (scope.data.movimientos[i].id_estado_movimiento == 83) {
								scope.data.movimientos[i].tipo_movimiento = "Ventanilla";
							}
							existe = false;
							for (var j = 0; j < scope.data.usuarios.length; j++) {
								if (scope.data.usuarios[j].Id == scope.data.movimientos[i].id_usuario_alta) {
									existe = true;
								}
							}
							if (!existe) {
								scope.data.usuarios.push(scope.data.movimientos[i].Usuario);
							}
						}
						$log.debug('FarmaciaController: rellenarDatosMovimientos OK.-');
					}
					else {
						scope.formControl.error = false;
						scope.filter.movimientos = [];
					}
				}

				function verDetalle(pMovimiento) {
					StockFarmaciaLogicService.movimiento = pMovimiento;
					// StockFarmaciaLogicService.materiales = scope.data.materiales;
					StockFarmaciaModalService.viewDetalle();
				}

				function printMovimiento(pMovimiento) {
					$log.debug('FarmaciaController: printMovimiento ON.-');
					pMovimiento.Sucursal = StockFarmaciaLogicService.usuario.sucursales[0].Id;
					StockFarmaciaModalService.printMovimiento(pMovimiento);
				}

				function printInternado(pMovimiento) {
					$log.debug('FarmaciaController: printInternado ON.-');
					if (pMovimiento.TipoMovimiento.nombre_tipo_movimiento == "Reposicion")
						StockFarmaciaModalService.printInternado(pMovimiento);
					if (pMovimiento.TipoMovimiento.nombre_tipo_movimiento == "Dosificacion" || pMovimiento.TipoMovimiento.nombre_tipo_movimiento == "Ventanilla")
						StockFarmaciaModalService.printInternadoDosificacion(pMovimiento);
					scope.formControl.loading = false;
				}

				function ubicacionChanged(pUbicacion) {
					if (pUbicacion != '' && pUbicacion != undefined) {
						scope.filter.id_ubicacion_hasta = pUbicacion.id_ubicacion;
						pageChanged();
					}
					else {
						scope.filter.id_ubicacion_hasta = '';
						pageChanged();
					}
					// scope.formControl.loading = false;
				}

				function cambiaSucursal() {
					if (scope.formData.sucursal.Id) {
						scope.formControl.loading = true;
						StockCommonDataService.getAllPisosPorEdificio(scope.formData.sucursal.Id)
							.then(function (_pisos) {
								StockCommonDataService.getFarmaciaByEdificio(scope.formData.sucursal.Id)
									.then(function (_farmacia) {
										scope.data.farmacia = _farmacia;
										StockFarmaciaLogicService.sucursal = scope.formData.sucursal;
										StockFarmaciaLogicService.farmacia = _farmacia;
										StockFarmaciaLogicService.pisos = _pisos;
										scope.formControl.limpiar = true;
										scope.data.usuarios = [];
										getMovimientos();
									}, function () {
										scope.formControl.loading = false;
									});
							}, function () {
								scope.formControl.loading = false;
							});
					}
				}

				scope.$watch(function () {
					return scope.print;
				}, function (newValue) {
					if (newValue) {
						$log.debug('entro watch');
						activate();
						scope.print = false;
					}
				});

				scope.$watch(function () {
					return scope.activate;
				}, function (newValue) {
					if (newValue) {
						if (newValue.NAME == "LISTADO")
							activate();
						// scope.activate = false;
					}
				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				// activate();

				function activate() {
					$log.debug('saStockTabListado ON');
					scope.data.ubicacionesPiso = StockFarmaciaLogicService.ubicacionesPiso;
					scope.data.farmacia = StockFarmaciaLogicService.farmacia;
					scope.data.movimientos = [];
					scope.data.materiales = StockFarmaciaLogicService.materiales;
					scope.formData.fecha_hasta = new Date();
					scope.formData.fecha_desde = new Date(Date.now() - 172800000);
					getMovimientos();
					scope.paginacion.currentPage = 1;
					scope.paginacion.pageSize = 10;
					scope.data.sucursales = StockFarmaciaLogicService.usuario.sucursales;
					scope.formData.sucursal = StockFarmaciaLogicService.sucursal;

				}

			}
		}
	};

	return module;
})();