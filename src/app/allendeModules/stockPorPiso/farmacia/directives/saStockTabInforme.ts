/**
 * @author:			Martin Astore
 * @description:	Pestaña Informe de Farmacia
 * @type:			Directive
 **/
import template = require('../templates/sa-stock-tab-informe.tpl.html');
import { IUbicacionDataService, IStockCommonDataService } from '../../common/services';
export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saStockTabInforme', saStockTabInforme);

		saStockTabInforme.$inject = ['$log', '$filter', 'uiGridConstants',
			'UbicacionDataService', 'StockCommonDataService',
			'StockFarmaciaLogicService'
		];
		function saStockTabInforme($log, $filter, uiGridConstants,
			UbicacionDataService: IUbicacionDataService, StockCommonDataService: IStockCommonDataService,
			StockFarmaciaLogicService) {

			return {
				restrict: 'E',
				scope: {
					title: '@?'
					// model : '=?'
				},
				template: template,
				link: link
			};

			function link(scope) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				var vm = this;

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
				scope.getInforme = getInforme;
				scope.ubicacionChanged = ubicacionChanged;
				scope.cambiaSucursal = cambiaSucursal;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				scope.gridOptions = {
					// Habilitar orden para todas las columnas, se deshabilita por la que no se quiere
					enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
					enableSorting: true,
					// Le asigno el scope si no es "scope"
					appScopeProvider: vm,
					onRegisterApi: function (gridApi) {
						scope.gridApi = gridApi;
					},
					enableGridMenu: true,
					enableRowSelection: true,
					// Habilita seleccionar fila completa
					enableFullRowSelection: true,
					// Habilita multiple selecicón
					multiSelect: false,
					// Habilita columna de seleccion con check
					enableRowHeaderSelection: false,
					// Habilita menu por header
					enableColumnMenus: true,
					// Habilita filtros en header
					enableFiltering: true,
					minRowsToShow: 10,
					columnDefs: [
						{
							field: 'Producto.numero_articulo',
							displayName: 'N° Articulo',
							headerTooltip: 'Número de articulo',
							// enableFiltering: true,
							filter: {
								condition: uiGridConstants.filter.STARTS_WITH
							},
							enableHiding: false,
							maxWidth: 220
						},
						{
							displayName: 'Descripcion',
							headerTooltip: 'Descripcion',
							field: 'Producto.nombre'
						},
						{
							displayName: 'Presentacion',
							headerTooltip: 'Presentacion',
							field: 'Producto.presentacion',
							enableFiltering: false,
							enableColumnResizing: false
						},
						{
							displayName: 'Stock Normal',
							headerTooltip: 'Stock Normal',
							field: 'stock_minimo',
							type: 'number',
							cellClass: 'text-center',
							enableFiltering: false
						},
						{
							name: 'Reposiciones',
							displayName: 'Reposiciones',
							type: 'number',
							headerTooltip: 'Cantidad de Reposiciones',
							field: 'Ubicacion.id_ubicacion',
							cellClass: 'text-center',
							enableFiltering: false
						},
						{

							displayName: 'Dosificacion',
							headerTooltip: 'Cantidad de Dosificacion',
							type: 'number',
							field: 'Ubicacion.tipo_ubicacion',
							cellClass: 'text-center',
							enableFiltering: false,
							visible: false
						},
						{

							displayName: 'Ventanilla',
							headerTooltip: 'Cantidad de Ventanilla',
							type: 'number',
							field: 'Ubicacion.tipo_ubicacion',
							cellClass: 'text-center',
							enableFiltering: false,
							visible: false
						}
					]
				};

				function ubicacionChanged(pUbicacion) {
					if (pUbicacion.id_ubicacion) {
						scope.data.ubicacion = pUbicacion;
						getInforme();
					}
				}

				function getInforme() {
					if (scope.data.ubicacion.id_ubicacion) {
						$log.debug('FarmaciaController: getInforme ON.-');
						scope.formControl.loading = true;
						scope.data.fecha_desde = $filter('date')(scope.formData.fecha_desde, 'MM/dd/yyyy');
						scope.data.fecha_hasta = $filter('date')(scope.formData.fecha_hasta, 'MM/dd/yyyy');
						var _object = {};
						_object['id_ubicacion'] = scope.data.ubicacion.id_ubicacion;
						_object['fecha_desde'] = scope.data.fecha_desde;
						_object['fecha_hasta'] = scope.data.fecha_hasta;
						UbicacionDataService.getInformeByUbicacionAndFechas(_object)
							.then(function (_ubicacion) {
								scope.data.ubicacionesDetalle = _ubicacion.DetalleStock;
								actualizarUbicacionesDetalle();
								// scope.gridOptions.data =_ubicacion.DetalleStock;
							});
					}
				}

				function actualizarUbicacionesDetalle() {
					$log.debug('FarmaciaController: actualizarUbicacionesDetalle ON.-');

					scope.gridOptions.data = [];

					if (scope.data.ubicacionesDetalle != null && scope.data.materiales != null) {
						scope.formControl.vacio = true;
						for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
							for (var k = 0; k < scope.data.materiales.length; k++) {
								if (scope.data.materiales[k].id_producto == scope.data.ubicacionesDetalle[i].id_producto) {
									scope.data.ubicacionesDetalle[i].Producto = {};
									scope.data.ubicacionesDetalle[i].Producto = scope.data.materiales[k]
									scope.data.ubicacionesDetalle[i].Producto.cantidad = scope.data.materiales[k].costo;
								}
							}

							if (scope.data.ubicacionesDetalle[i].Producto != undefined) {
								scope.gridOptions.data.push(scope.data.ubicacionesDetalle[i]);
								scope.formControl.vacio = false;
							}
						}
					}
					scope.formControl.loading = false;
				}

				function cambiaSucursal() {
					if (scope.formData.sucursal.Id) {
						scope.formControl.loading = true;
						StockFarmaciaLogicService.sucursal = scope.formData.sucursal;
						StockCommonDataService.getAllPisosPorEdificio(scope.formData.sucursal.Id)
							.then(function (_pisos) {
								StockCommonDataService.getFarmaciaByEdificio(scope.formData.sucursal.Id)
									.then(function (_farmacia) {
										scope.data.farmacia = _farmacia;
										StockFarmaciaLogicService.farmacia = _farmacia;
										StockFarmaciaLogicService.pisos = _pisos;
										scope.formControl.limpiar = true;
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

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				activate();

				function activate() {
					$log.debug('saStockTabInforme ON');
					scope.data.ubicacionesPiso = StockFarmaciaLogicService.ubicacionesPiso;
					scope.data.farmacia = StockFarmaciaLogicService.farmacia;
					scope.data.materiales = StockFarmaciaLogicService.materiales;
					scope.data.sucursales = StockFarmaciaLogicService.usuario.sucursales;
					scope.formData.sucursal = StockFarmaciaLogicService.sucursal;

					scope.data.movimientos = [];
					scope.formData.fecha_hasta = new Date();
					scope.formData.fecha_desde = new Date(Date.now() - 864000000);
				}
			}
		}
	};

	return module;
})();