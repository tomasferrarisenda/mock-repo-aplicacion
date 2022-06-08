/**
 * @author:			Martin Astore
 * @description:	Pestaña Reposicon de Farmacia
 * @type:			Directive
 **/
import template = require('./sa-stock-tab-reposicion.tpl.html');
import { IUbicacionDataService, IMovimientoStockDataService } from '../../../common/services';
import { IStockFarmaciaModalService } from '../../services';
export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saStockTabReposicion', saStockTabReposicion);

		saStockTabReposicion.$inject = ['$log', 'ModalService', 'AlertaService',
			'UbicacionDataService', 'MovimientoStockDataService',
			'StockFarmaciaModalService',
			'StockFarmaciaLogicService'];
		function saStockTabReposicion($log, ModalService: IModalService, AlertaService: IAlertaService,
			UbicacionDataService: IUbicacionDataService, MovimientoStockDataService: IMovimientoStockDataService,
			StockFarmaciaModalService: IStockFarmaciaModalService,
			StockFarmaciaLogicService) {

			return {
				restrict: 'E',
				scope: {
					title: '@?',
					carga: '&cargaOk',
					activate: '<'
				},
				template: template,
				link: link
			};

			function link(scope) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					tiposUbicacion: [],
					farmacia: {},
					usuario: {},
					materiales: [],
					movimiento: {},
					ubicacionesDetalle: [],
					movimientosDetalleCargados: [],
					listaAsignados: []
				};

				scope.formData = {
					ubicacion: {}
				};

				scope.formControl = {
					ubicacionCargada: false,
					loading: false,
					loadingInternaciones: false,
					vacio: false,
					limpiar: false
				};

				scope.ubicacionChanged = ubicacionChanged;
				scope.cargarDetalleMovimiento = cargarDetalleMovimiento;
				scope.reponer = reponer;
				scope.limpiar = limpiar;
				scope.tipoUbicacionChanged = tipoUbicacionChanged;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function ubicacionChanged(pUbicacion) {

					$log.debug('pUbicacion', pUbicacion);
					if (pUbicacion) {
						scope.formData.ubicacion = pUbicacion;
						scope.formControl.vacio = false;
					}
					else {
						scope.formData.ubicacion = pUbicacion;
						scope.formControl.vacio = false;
						scope.formControl.ubicacionCargada = false;
						scope.data.listaAsignados = [];
						scope.data.ubicacionesDetalle = [];
					}
					if (scope.formData.ubicacion) {
						$log.debug('Ubicacion changed and define');
						scope.formControl.ubicacionCargada = true;
						scope.formControl.loading = true;
						nuevoMovimiento();
						getInternacionesReposicionPorUbicacion();
						getUbicacionesDetalle();
					}
				}

				function tipoUbicacionChanged() {
					if (scope.formData.ubicacion) {
						$log.debug('Ubicacion changed and define');
						scope.formControl.ubicacionCargada = true;
						scope.formControl.loading = true;
						nuevoMovimiento();
						getInternacionesReposicionPorUbicacion();
						getUbicacionesDetalle();
					}
				}

				function nuevoMovimiento() {
					scope.data.movimiento = {};
					scope.data.movimiento.id_ubicacion_desde = scope.data.farmacia.Ubicacion.id_ubicacion;
					scope.data.movimiento.id_ubicacion_hasta = scope.formData.ubicacion.id_ubicacion; //ubicacion piso
					scope.data.movimiento.id_usuario_alta = scope.data.usuario.id;
					scope.data.movimiento.fecha_hora = '';
					scope.data.movimiento.DetallesMovimiento = [];
					scope.data.movimiento.MovimientosStock = [];
					scope.data.movimiento.id_estado_movimiento = 53;
					scope.data.movimiento.id_movimiento = scope.formData.tipoUbicacion.id_tipo_ubicacion_detalle;
					$log.debug('FarmaciaController: nuevoMovimiento OK.-');
				}

				function getInternacionesReposicionPorUbicacion() {
					scope.formControl.loadingInternaciones = true;
					UbicacionDataService.getInternacionesPendientesReposicionByUbicacion(scope.formData.ubicacion.id_ubicacion)
						.then(function (pInternaciones) {
							scope.data.internaciones = pInternaciones;
							scope.formControl.loadingInternaciones = false;
							// filtroInternacion();
							$log.debug('FarmaciaController: getInternacionesReposicionPorUbicacion.-', pInternaciones);
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function getUbicacionesDetalle() {
					scope.formControl.loading = true;
					scope.data.ubicacionesDetalle = [];
					UbicacionDataService.getTotalNoRepuestoByUbicacionAndTipo(scope.formData.ubicacion.id_ubicacion,
						scope.formData.tipoUbicacion.id_tipo_ubicacion_detalle)
						.then(function (_ubicaciones) {
							scope.data.ubicacionesDetalle = _ubicaciones;
							$log.debug('FarmaciaController: getUbicacionesDetalleByUbicacion OK.-', scope.data.ubicacionesDetalle);
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
									// scope.data.ubicacionesDetalle[i].Producto.cantidad = scope.data.materiales[k].costo;
								}
							}
						}
						if (scope.data.ubicacionesDetalle.length == 0) {
							scope.formControl.vacio = true;
						}
					}
					scope.formControl.loading = false;
					$log.debug('FarmaciaController: cargarProductos OK.-');
				}


				function cargarDetalleMovimiento(pUbicacionDetalle) {
					StockFarmaciaLogicService.internacion = '';
					StockFarmaciaLogicService.internaciones = scope.data.internaciones;
					StockFarmaciaLogicService.ubicacion = scope.formData.ubicacion;
					StockFarmaciaLogicService.ubicacionDetalle = pUbicacionDetalle;
					StockFarmaciaLogicService.ubicacionesDetalle = scope.data.ubicacionesDetalle;
					StockFarmaciaLogicService.movimiento = scope.data.movimiento;
					StockFarmaciaLogicService.movimientosDetalleCargados = scope.data.movimientosDetalleCargados;
					StockFarmaciaModalService.viewDetalleReposicion()
						.then(function () {
							scope.data.ubicacionesDetalle = StockFarmaciaLogicService.ubicacionesDetalle;
							scope.data.movimiento = StockFarmaciaLogicService.movimiento;
							scope.data.movimientosDetalleCargados = StockFarmaciaLogicService.movimientosDetalleCargados;
						});
				}

				function reponer() {
					scope.formControl.loading = true;
					ModalService.confirm("¿Desea enviar la reposicion al piso?", function (pRes) {
						if (pRes) {
							$log.debug('FarmaciaController: guardarMovimiento ON.-');
							for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
								if (scope.data.ubicacionesDetalle[i].cantidad_productos != undefined) {
									scope.data.listaAsignados.push(scope.data.ubicacionesDetalle[i]);
								}
							}
							if (scope.data.listaAsignados.length > 0) {
								for (var i = 0; i < scope.data.movimiento.DetallesMovimiento.length; i++) {
									scope.data.movimiento.DetallesMovimiento[i].MovimientoStock = null;
								}
								MovimientoStockDataService.reponerMovimiento(scope.data.movimiento)
									.then(function () {
										$log.debug('FarmaciaController: guardarMovimiento OK.-');
										//fnc.generarExcel();
										// ModalService.success('Movimiento Cargado');
										ModalService.confirm('Movimiento Cargado. ¿Desea imprimir el remito ahora?', function (pResult) {
											if (pResult) {
												StockFarmaciaLogicService.ubicacion = scope.formData.ubicacion;
												StockFarmaciaLogicService.print = true;
												$log.debug('va entrar cargaOK');
												scope.carga();
												limpiar();
											}
											else {
												scope.formControl.loading = false;
												limpiar();
											}
										});
									}, function () {
										scope.formControl.loading = false;
									});
							}
							else {
								AlertaService.NewWarning("Atencion", 'No cargo ningun descartable');
								scope.formControl.loading = false;
							}
						}
						else {
							scope.formControl.loading = false;
						}
					});
				}

				function limpiar() {
					scope.formControl.ubicacionCargada = false;
					scope.formControl.cargado = false;
					scope.formControl.vacio = false;
					scope.data.listaAsignados = [];
					scope.data.movimientosDetalleCargados = [];
					scope.formData.internacion = '';
					scope.formData.piso = '';
					scope.formData.ubicacion = '';
					scope.data.ubicacionesDetalle = [];
					scope.formData.tipoUbicacion = scope.data.tiposUbicacion[0];
					scope.formControl.limpiar = true;
					nuevoMovimiento();
				}

				scope.$watch(function () {
					return scope.activate;
				}, function (newValue) {
					if (newValue.NAME == "REPOSICION") {
						limpiar();
						// scope.activate = false;
					}
				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				activate();

				function activate() {
					$log.debug('saStockTabReposicion ON', StockFarmaciaLogicService.usuario);
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