/**
 * @author:			Martin Astore
 * @description:	Pestaña Ajuste de Farmacia
 * @type:			Directive
 **/

import template = require( '../templates/sa-stock-tab-ajuste.tpl.html');
import { IUbicacionDataService, IUbicacionDetalleStockDataService } from '../../common/services';
import { IStockFarmaciaModalService } from '../services';
export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saStockTabAjuste', saStockTabAjuste);

		saStockTabAjuste.$inject = ['$log', '$q',
			'ModalService', 'AlertaService',
			'UbicacionDataService',
			'UbicacionDetalleStockDataService',
			'StockFarmaciaModalService',
			'StockFarmaciaLogicService'];
		function saStockTabAjuste($log, $q,
			ModalService: IModalService, AlertaService: IAlertaService,
			UbicacionDataService: IUbicacionDataService,
			UbicacionDetalleStockDataService: IUbicacionDetalleStockDataService,
			StockFarmaciaModalService: IStockFarmaciaModalService,
			StockFarmaciaLogicService) {

			return {
				restrict: 'E',
				scope: {
					title: '@?',
					carga: '&cargaOk',
					activate: '='
				},
				template: template,
				link: link
			};

			function link(scope) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					materiales: [],
					ubicacion: {},
					ubicacionesDetalle: [],
					listaAsignados: []
				};

				scope.formData = {
					tipoUbicacion: {},
					descartableNuevo: ''
				};

				scope.formControl = {
					loading: false,
					ubicacionCargada: false,
					vacio: false
				};

				scope.limpiar = limpiar;
				scope.ubicacionChanged = ubicacionChanged;
				scope.nuevoAjuste = nuevoAjuste;
				scope.nuevoMaterial = nuevoMaterial;
				scope.printStock = printStock;
				scope.deleteUbicacionDetalle = deleteUbicacionDetalle;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function ubicacionChanged(pUbicacion) {
					if (pUbicacion) {
						scope.data.ubicacion = pUbicacion;
						scope.formControl.vacio = false;
					}
					if (scope.data.ubicacion !== "") {
						getUbicacionesDetalle();
						scope.formControl.ubicacionCargada = true;
					}
					else {
						scope.formControl.vacio = false;
						scope.formControl.ubicacionCargada = false;
					}
				}

				function getUbicacionesDetalle() {
					scope.formControl.loading = true;
					scope.data.ubicacionesDetalle = [];
					UbicacionDataService.getUbicacionesDetalleByUbicacionAndTipo(scope.data.ubicacion.id_ubicacion,
						scope.formData.tipoUbicacion.id_tipo_ubicacion_detalle)
						.then(function (_ubicaciones) {
							scope.data.ubicacionesDetalle = _ubicaciones;
							$log.debug('FarmaciaController: getUbicacionesDetalleByUbicacion OK.-', _ubicaciones);
							scope.formControl.loading = false;
							cargarProductos();
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function cargarProductos() {
					$log.debug('FarmaciaController: cargarProductos ON.-');
					if (scope.data.ubicacionesDetalle != null && scope.data.materiales != null) {
						scope.formControl.vacio = false;
						for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
							for (var k = 0; k < scope.data.materiales.length; k++) {
								if (scope.data.materiales[k].id_producto == scope.data.ubicacionesDetalle[i].id_producto) {
									scope.data.ubicacionesDetalle[i].Producto = {};
									scope.data.ubicacionesDetalle[i].Producto = scope.data.materiales[k];
								}
							}
						}
						if (scope.data.ubicacionesDetalle.length === 0) {
							scope.formControl.vacio = true;
						}
					}
					scope.formControl.loading = false;
					$log.debug('FarmaciaController: cargarProductos OK.-');
				}

				function nuevoAjuste() {
					scope.formControl.loading = true;
					$log.debug('FarmaciaController: guardarMovimiento ON.-');
					scope.data.listaAsignados = [];
					scope.data.listaAsignadosMaxima = [];
					for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
						if (scope.data.ubicacionesDetalle[i].cantidad_productos >= 0) {
							scope.data.listaAsignados.push(scope.data.ubicacionesDetalle[i]);
						}
						if (scope.data.ubicacionesDetalle[i].nueva_cantidad_maxima >= 0) {
							scope.data.listaAsignadosMaxima.push(scope.data.ubicacionesDetalle[i]);
						}
					}
					if (scope.data.listaAsignados.length > 0 ||
						scope.data.listaAsignadosMaxima.length > 0) {
						var array: Array<any> = [];
						for (var i = scope.data.listaAsignados.length - 1; i >= 0; i--) {
							array[i] = UbicacionDetalleStockDataService.
								actualizarUbicacionesDetalle(scope.data.listaAsignados[i].id_ubicacion_detalle,
								scope.data.listaAsignados[i].cantidad_productos,
								scope.data.usuario.id);
						}
						for (var i = scope.data.listaAsignadosMaxima.length - 1; i >= 0; i--) {
							array[i] = UbicacionDetalleStockDataService.
								actualizarUbicacionesDetalleMaxima(scope.data.listaAsignadosMaxima[i].id_ubicacion_detalle,
								scope.data.listaAsignadosMaxima[i].nueva_cantidad_maxima);
						}
						$q.all(array).then(function () {
							AlertaService.NewSuccess('Cambios guardados correctamente');
							ubicacionChanged(null);
						}, function () {
							scope.formControl.loading = false;
						});
					}
					else {
						AlertaService.NewWarning('No cargo ningun producto');
					}
					scope.formControl.loading = false;
				}

				function nuevoMaterial() {
					$log.debug('FarmaciaController: nuevoMaterial ON.-');
					if (scope.formData.descartableNuevo && scope.data.ubicacion) {
						var existe = false;
						for (var i = scope.data.ubicacionesDetalle.length - 1; i >= 0; i--) {
							if (scope.data.ubicacionesDetalle[i].id_producto == scope.formData.descartableNuevo.id_producto) {
								existe = true;
							}
						}
						if (!existe) {
							ModalService.confirm("¿Desea agregar " + scope.formData.descartableNuevo.nombre + " al piso?", function (pResult) {
								if (pResult) {
									UbicacionDataService.
										nuevoDetalleUbicacionByUbicacionYMaterialYTipo(scope.data.ubicacion.id_ubicacion,
										scope.formData.descartableNuevo.id_material,
										scope.formData.tipoUbicacion.id_tipo_ubicacion_detalle)
										.then(function () {
											AlertaService.NewSuccess("Descartable agregado con exito.");
											getUbicacionesDetalle();
											scope.formData.descartableNuevo = '';
										}, function () {
											scope.formControl.loading = false;
										});
								}
							});
						}
					}
				}

				function deleteUbicacionDetalle(pUbicacionDetalle) {
					$log.debug('FarmaciaController: deleteUbicacionDetalle ON.-', pUbicacionDetalle);
					UbicacionDetalleStockDataService.deleteUbicacionDetalle(pUbicacionDetalle.id_ubicacion_detalle)
						.then(function (pUbicacionDetalle) {
							if (pUbicacionDetalle == null) {
								AlertaService.NewSuccess("Descartable Eliminado");
								ubicacionChanged(null);
								scope.formData.descartableNuevo = '';
							}
							else {
								AlertaService.NewWarning("Atencion", "No se pudo eliminar, el producto esta en uso");
							}
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function printStock() {
					scope.data.ubicacion.DetalleStock = scope.data.ubicacionesDetalle;
					StockFarmaciaModalService.printStockMinimo(scope.data.ubicacion);
				}

				function limpiar() {
					scope.data.listaAsignados = [];
					scope.data.ubicacionesDetalle = [];
					scope.formControl.ubicacionCargada = false;
					scope.formData.tipoUbicacion = scope.data.tiposUbicacion[0];
					scope.formControl.limpiar = true;
				}

				scope.$watch(function () {
					return scope.activate;
				}, function (newValue) {
					if (newValue) {
						limpiar();
						scope.activate = false;
					}
				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

				activate();

				function activate() {
					$log.debug('saStockTabAjuste ON', StockFarmaciaLogicService.usuario);
					scope.data.tiposUbicacion = StockFarmaciaLogicService.tiposUbicacion;
					scope.data.farmacia = StockFarmaciaLogicService.farmacia;
					scope.data.usuario = StockFarmaciaLogicService.usuario;
					scope.data.materiales = StockFarmaciaLogicService.materiales;

					scope.formData.tipoUbicacion = scope.data.tiposUbicacion[0];
				}
			}
		}
	};

	return module;
})();