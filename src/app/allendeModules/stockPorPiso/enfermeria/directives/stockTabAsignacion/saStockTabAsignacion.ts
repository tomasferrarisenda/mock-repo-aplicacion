/**
 * @author:			Martin Astore
 * @description:	Pestaña Asignacion de Enfermeria
 * @type:			Directive
 **/
import * as angular from 'angular';

import asignacionTemplate = require('./sa-stock-tab-asignacion.tpl.html');
import { IUbicacionDataService, IEnfermeraDataService, IStockCommonDataService, IStockCommonLogicService } from '../../../common/services';
import { ICuestionarioService } from '../../../../support/cuestionario';
import { IStockEnfermeriaModalService } from '../../services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saStockTabAsignacion', saStockTabAsignacion);

		saStockTabAsignacion.$inject = ['$log', '$filter', 'AlertaService',
			'UbicacionDataService', 'EnfermeraDataService',
			'StockCommonDataService', 'StockCommonLogicService',
			'StockEnfermeriaModalService',
			'StockEnfermeriaLogicService','CuestionarioService'];
		function saStockTabAsignacion($log, $filter, AlertaService: IAlertaService,
			UbicacionDataService: IUbicacionDataService, EnfermeraDataService: IEnfermeraDataService,
			StockCommonDataService: IStockCommonDataService, StockCommonLogicService: IStockCommonLogicService,
			StockEnfermeriaModalService: IStockEnfermeriaModalService,
			StockEnfermeriaLogicService, CuestionarioService: ICuestionarioService) {
			return {
				restrict: 'E',
				scope: {
					title: '@?',
					activate: '='
					// model : '=?'
				},
				template: asignacionTemplate,
				link: link
			};

			function link(scope) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					internaciones: [],
					ubicacionesDetalle: []
				};

				scope.formData = { };

				scope.formControl = {
					loading: false,
					supervisor: false,
					internacionCargada: false
				};

				scope.filter = {
					producto: ''
				};

				scope.limpiar = limpiar;
				scope.pisoChanged = pisoChanged;
				scope.ubicacionChanged = ubicacionChanged;
				scope.controlarUbicacionInternacion = controlarUbicacionInternacion;
				scope.printUtilizados = printUtilizados;
				scope.print = print;
				scope.help = help;
				scope.validarInternacion = validarInternacion;
				scope.filtrar = filtrar;
				scope.suma = suma;
				scope.resta = resta;

				scope.cuestionarioUpa = cuestionarioUpa;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function inicializarVariables() {
					scope.data.pisos = StockEnfermeriaLogicService.pisos;
					scope.data.ubicacionesPiso = StockEnfermeriaLogicService.ubicacionesPiso;
					scope.data.usuario = StockEnfermeriaLogicService.usuario;
					scope.data.materiales = StockEnfermeriaLogicService.materiales;
					scope.data.tiposUbicacion = StockEnfermeriaLogicService.tiposUbicacion;
					scope.formData.tipoUbicacion = scope.data.tiposUbicacion[0];
					scope.formControl.veTodosLosPisos = StockEnfermeriaLogicService.veTodosLosPisos;
				}
				/**
				 * Carga las ubicaciones por sucursal (La primera del usuario) y usuario
				 */
				function cargarUbicacion() {
					$log.debug('EnfermeriaController: cargarUbicacion ON.-');
					scope.formData.ubicacion = '';
					scope.formData.internacion = '';
					EnfermeraDataService.getUbicacionesByUsuarioAndSucursal(0, scope.data.usuario.sucursales[0].Id)
						.then(function (pUbicaciones) {
							scope.data.ubicaciones = pUbicaciones;
							$log.debug('EnfermeriaController: cargarUbicacion OK.-');
							scope.formControl.loading = false;
							scope.formControl.error = false;
							if (scope.data.ubicaciones.length == 1) {
								scope.formData.ubicacion = scope.data.ubicaciones[0];
								getUbicacion();
							}
							else if (scope.data.ubicaciones.length == 0) {
								AlertaService.NewError("Sin Ubicaciones", "No posee cargada ninguna ubicacion, contáctese con su supervisor");
							}
						}, function () {
							scope.formControl.loading = false;
						});
				}

				/**
				 * Busca las ubicaciones por piso (si se cargo correctaente)
				 */
				function pisoChanged() {
					scope.formControl.vacio = false;
					scope.data.ubicacion = null;
					$log.debug('EnfermeriaController: getUbicacionPorPiso ON.-');
					// Si el piso cambió
					if (scope.data.piso != scope.formData.piso) {
						// Elimino las ubicaciones detalle
						scope.formControl.ubicacionCargada = false;
						scope.filter.ubicacionesDetalle = [];
						// Si el piso no es nulo
						if (scope.formData.piso != null) {
							// Guardo el piso actual y busco las ubicaciones por piso
							scope.data.ubicaciones = [];
							scope.data.piso = scope.formData.piso;
							scope.data.ubicaciones = StockCommonLogicService
								.getUbicacionMedicaByPiso(scope.data.piso, scope.data.ubicacionesPiso);
						}
					}
				}

				function ubicacionChanged() {
					scope.formControl.vacio = false;
					scope.formData.esScrap = false;
					scope.formControl.internacionCargada = false;
					scope.data.ubicacionesDetalle = [];
					scope.filter.ubicacionesDetalle = [];
					scope.formControl.ubicacionCargada = false;

					if (scope.formData.ubicacion && scope.formData.ubicacion != '') {
						scope.formControl.ubicacionCargada = true;
						scope.formControl.loading = true;
						scope.data.ubicacion = scope.formData.ubicacion;
						getUbicacion();

					}
					else {
						scope.formControl.internado = false;
					}
				}

				function getUbicacion() {
					scope.formData.internacion = '';
					scope.formControl.loading = true;
					$log.debug('EnfermeriaController: getUbicacion ON.-');
					scope.formData.internacion = '';
					scope.data.ubicacionesDetalle = [];
					UbicacionDataService.getUbicacionById(scope.formData.ubicacion.id_ubicacion)
						.then(function (pUbicacion) {
							scope.data.ubicacion = pUbicacion;
							scope.data.ubicacionesDetalle = pUbicacion.DetalleStock;
							scope.data.ubicacion.nombre_ubicacion_piso = scope.formData.ubicacion.nombre_ubicacion_piso;
							scope.formControl.ubicacionCargada = true;
							$log.debug('EnfermeriaController: getUbicacion OK.-', scope.data.ubicacion);
							nuevoMovimiento();
							getMaterialesPorUbicacion();
							if (!StockEnfermeriaLogicService.veTodosLosPacientes) {
								scope.data.internaciones = [];
								getInternacionesPorUbicacion();
							}
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function getInternacionesPorUbicacion() {
					$log.debug('EnfermeriaController: getInternacionesPorUbicacion ON.-');
					UbicacionDataService.getInternacionesPorUbicacion(scope.formData.ubicacion.id_ubicacion)
						.then(function (pInternaciones) {
							scope.data.internaciones = pInternaciones;
							scope.formControl.loading = false;
							$log.debug('EnfermeriaController: getInternacionesPorUbicacion OK.-');
						}, function () {
							scope.formControl.loading = false;
						});
				}


				function nuevoMovimiento() {
					scope.data.movimiento = {};
					scope.data.movimiento = {
						id_movimiento: scope.formData.tipoUbicacion.id_tipo_ubicacion_detalle,
						id_ubicacion_desde: scope.data.ubicacion.id_ubicacion,
						id_ubicacion_hasta: null, // ubicacion Paciente
						fecha_hora: '',
						DetallesMovimiento: [],
						id_usuario_alta: scope.data.usuario.id
					};
					$log.debug('EnfermeriaController: nuevoMovimiento OK.-');
				}

				function getMaterialesPorUbicacion() {
					$log.debug('EnfermeriaController: getMaterialesPorUbicacion OK.-');
					scope.data.movimiento.id_movimiento = scope.formData.tipoUbicacion.id_tipo_ubicacion_detalle;
					UbicacionDataService
						.getUbicacionesDetalleByUbicacionAndTipo(scope.data.ubicacion.id_ubicacion,
						scope.formData.tipoUbicacion.id_tipo_ubicacion_detalle)
						.then(function (pUbicaciones) {
							scope.data.materialesFiltro = [];
							scope.formControl.error = false;
							scope.data.ubicacionesDetalle = pUbicaciones;
							if (scope.data.ubicacionesDetalle != null && scope.data.materiales != null) {
								for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
									let existeProducto = false;
									for (var j = 0; j < scope.data.materiales.length; j++) {
										if (scope.data.materiales[j].id_producto == scope.data.ubicacionesDetalle[i].id_producto) {
											existeProducto = true;
											scope.data.ubicacionesDetalle[i].Producto = {};
											scope.data.ubicacionesDetalle[i].Producto = scope.data.materiales[j];
											scope.data.ubicacionesDetalle[i].cantidad_productos = 0;
											scope.data.ubicacionesDetalle[i].minimo = true;
											scope.data.materialesFiltro.push(scope.data.materiales[j]);
										}
										if (scope.data.ubicacionesDetalle[i].stock_actual == 0)
											scope.data.ubicacionesDetalle[i].maximo = true;
									}
									if (!existeProducto) {
										let mensaje = `No existe el producto ${scope.data.ubicacionesDetalle[i].id_producto} en materiales para la ubicacion y tipo actual`;
										// let mensaje = `No existe el producto ${scope.data.ubicacionesDetalle[i].id_producto} en materiales para la ubicacion ${scope.data.ubicacion.id_ubicacion} y tipo ${scope.formData.tipoUbicacion.id_tipo_ubicacion_detalle}`;
										AlertaService.NewError(mensaje);
									}
								}
								orderByName();
								$log.debug('EnfermeriaController: getUbicacionesDetalleByUbicacion OK.-');
							}
							//scope.formControl.loading = false;
							if (StockEnfermeriaLogicService.veTodosLosPacientes) {
								scope.formControl.loading = false;
							}
							scope.formControl.error = false;
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function orderByName() {
					var byName = scope.data.ubicacionesDetalle.slice(0);
					byName.sort(function (a, b) {
						var x = (a.Producto) ? a.Producto.nombre.toLowerCase(): '';
						var y = (b.Producto) ? b.Producto.nombre.toLowerCase(): '';
						return x < y ? -1 : x > y ? 1 : 0;
					});
					scope.data.ubicacionesDetalle = byName;
					if (scope.data.ubicacion != "") {
						scope.data.ubicacion.DetalleStock = scope.data.ubicacionesDetalle;
						filtrar();
					}
				}

				function filtrar() {
					scope.filter.ubicacionesDetalle = $filter('filter')
						(scope.data.ubicacionesDetalle, {
							Producto:
							{
								nombre: scope.filter.producto.nombre
							}
						});
				}

				function validarInternacion() {
					$log.debug('EnfermeriaController: validarInternacion ON.-');
					if (scope.formData.internacion.numero_internado != undefined) {
						scope.formControl.guardar = false;
						scope.formControl.internacionCargada = true;
						angular.element("[name='searchText']").focus();
					}
					else {
						scope.formControl.internacionCargada = false;
						scope.formControl.guardar = true;
					}
					for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
						scope.data.ubicacionesDetalle[i].cantidad_productos = 0;
						scope.data.ubicacionesDetalle[i].minimo = true;
						if (scope.data.ubicacionesDetalle[i].stock_actual == 0) {
							scope.data.ubicacionesDetalle[i].maximo = true;
						}
						else {
							scope.data.ubicacionesDetalle[i].maximo = false;
						}
					}
					scope.data.ubicacionesDetalleCargadas = [];
					scope.data.listaAsignados = [];
					nuevoMovimiento();
				}

				function controlarUbicacionInternacion() {
					$log.debug('EnfermeriaController: controlarUbicacionInternacion ON.-', scope.formData.internacion);
					if (scope.formData.internacion != '' && scope.formData.internacion.numero_internado != undefined && !scope.formData.esScrap) {
						scope.formControl.loading = true;
						if (scope.formData.internacion.id_ubicacion_internado == null) {
							StockCommonDataService.newUbicacionInternacion(scope.formData.internacion.numero_internado)
								.then(function (pIdUbicacion) {
									// scope.formData.internacion.Ubicacion[0] = {id_ubicacion: ''};
									scope.formData.internacion.id_ubicacion_internado = pIdUbicacion.id_ubicacion;
									$log.debug('EnfermeriaController: newUbicacionInternacion OK.-');
									guardarMovimiento();
								}, function () {
									scope.formControl.loading = false;
								});
						}
						else {
							guardarMovimiento();
						}
					}
					else {

						if (!scope.formData.esScrap) {
							AlertaService.NewWarning("Atencion", 'No selecciono ningun internado ni scrap');
						}
						else {
							cargarScrap();
						}
					}
				}

				function guardarMovimiento() {
					scope.formControl.loading = true;
					$log.debug('EnfermeriaController: guardarMovimiento ON.-');
					if (scope.formData.internacion != null) {
						scope.data.movimiento.id_ubicacion_hasta = scope.formData.internacion.id_ubicacion_internado;// ubicacion Paciente
					}
					scope.data.movimiento.id_estado_movimiento = 48;
					scope.data.movimiento.DetallesMovimiento = [];
					scope.data.listaAsignados = [];
					var detalle;

					for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
						if (scope.data.ubicacionesDetalle[i].cantidad_productos != 0) {
							scope.data.listaAsignados.push(scope.data.ubicacionesDetalle[i]);
							detalle = {
								id_tipo_movimiento: 1,
								id_producto: scope.data.ubicacionesDetalle[i].id_producto,
								costo_actual: scope.data.ubicacionesDetalle[i].Producto.costo,
								cantidad_productos: scope.data.ubicacionesDetalle[i].cantidad_productos
							};
							scope.data.movimiento.DetallesMovimiento.push(detalle);
							detalle = {
								id_tipo_movimiento: 2,
								id_producto: scope.data.ubicacionesDetalle[i].id_producto,
								costo_actual: scope.data.ubicacionesDetalle[i].Producto.costo,
								cantidad_productos: scope.data.ubicacionesDetalle[i].cantidad_productos
							};
							scope.data.movimiento.DetallesMovimiento.push(detalle);
						}
					}
					if (scope.data.movimiento.DetallesMovimiento.length > 0) {
						StockEnfermeriaModalService.newAsignacion(scope.data.movimiento, scope.data.listaAsignados, scope.formData.internacion)
							.then(function () {
								scope.formControl.loading = false;
								$log.debug('EnfermeriaController: guardarMovimiento OK.-');
								getMaterialesPorUbicacion();
								scope.formData.internacion = '';
								validarInternacion();
							}, function () {
								ubicacionChanged();
							});
					}
					else {
						AlertaService.NewWarning("Atencion", 'No cargo ningun descartable');
					}
					scope.formControl.loading = false;
				}

				function cargarScrap() {
					scope.formControl.loading = true;
					if (scope.formData.esScrap) {
						$log.debug('EnfermeriaController: cargarScrap ON.-');
						scope.data.movimiento.id_estado_movimiento = 49;
						scope.data.movimiento.DetallesMovimiento = [];
						scope.data.listaAsignados = [];
						var detalle;
						for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
							if (scope.data.ubicacionesDetalle[i].cantidad_productos > 0) {
								scope.data.listaAsignados.push(scope.data.ubicacionesDetalle[i]);
								detalle = {
									id_tipo_movimiento: 1,
									id_producto: scope.data.ubicacionesDetalle[i].id_producto,
									costo_actual: scope.data.ubicacionesDetalle[i].Producto.costo,
									cantidad_productos: scope.data.ubicacionesDetalle[i].cantidad_productos
								};
								scope.data.movimiento.DetallesMovimiento.push(detalle);
								detalle = {
									id_tipo_movimiento: 2,
									id_producto: scope.data.ubicacionesDetalle[i].id_producto,
									costo_actual: scope.data.ubicacionesDetalle[i].Producto.costo,
									cantidad_productos: scope.data.ubicacionesDetalle[i].cantidad_productos
								};
								scope.data.movimiento.DetallesMovimiento.push(detalle);
							}
						}
						if (scope.data.listaAsignados.length > 0) {
							scope.formControl.guardar = true;
							StockEnfermeriaLogicService.ubicacionesDetalle = scope.data.listaAsignados;
							StockEnfermeriaLogicService.movimiento = scope.data.movimiento;
							StockEnfermeriaModalService.newScrapEnfermera()
								.then(function () {
									getMaterialesPorUbicacion();
									limpiar();
								});
						}
						else {
							AlertaService.NewWarning("Atencion", 'No cargo ningun descartable');
						}
						scope.formControl.loading = false;
					}
					else {
						scope.formControl.guardar = false;
					}
				}

				function suma(pDetalle) {
					if (pDetalle != undefined) {
						for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
							if (scope.data.ubicacionesDetalle[i].id_producto == pDetalle.id_producto) {
								scope.data.ubicacionesDetalle[i].cantidad_productos += 1;
								scope.data.ubicacionesDetalle[i].minimo = false;
								if (scope.data.ubicacionesDetalle[i].cantidad_productos == scope.data.ubicacionesDetalle[i].stock_actual) {
									scope.data.ubicacionesDetalle[i].maximo = true;
								}
							}
						}
					}
				}

				function resta(pDetalle) {
					if (pDetalle != undefined) {
						for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
							if (scope.data.ubicacionesDetalle[i].id_producto == pDetalle.id_producto) {
								scope.data.ubicacionesDetalle[i].cantidad_productos -= 1;
								scope.data.ubicacionesDetalle[i].maximo = false;
								if (scope.data.ubicacionesDetalle[i].cantidad_productos == 0) {
									scope.data.ubicacionesDetalle[i].minimo = true;
								}
							}
						}
					}
				}

				function print() {
					scope.data.ubicacion.DetalleStock = scope.data.ubicacionesDetalle;
					StockEnfermeriaModalService.printStockActual(scope.data.ubicacion);

				}

				function printUtilizados() {
					scope.data.ubicacion.DetalleStock = scope.data.ubicacionesDetalle;
					StockEnfermeriaModalService.printUtilizados(scope.data.ubicacion, scope.formData.tipoUbicacion);
				}

				function help() {
					window.open('pdf/manual-stock-enfermeria.pdf', '_blank');
				}

				function limpiar() {
					scope.data.movimiento = {};
					scope.data.movimiento.DetallesMovimiento = [];
					scope.data.listaAsignados = [];
					for (var i = 0; i < scope.data.ubicacionesDetalle.length; i++) {
						scope.data.ubicacionesDetalle[i].cantidad_productos = 0;
						scope.data.ubicacionesDetalle[i].minimo = true;
					}
					ubicacionChanged();
					scope.formData.esScrap = false;
					scope.formData.internacion = '';
					scope.data.ubicacionesDetalleCargadas = [];
				}

				function cuestionarioUpa() {
					CuestionarioService.NewCuestionario(2,1,scope.formData.internacion.id_internacion, false);
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
					inicializarVariables();
					$log.debug('StockEnfermeriaLogicService.veTodosLosPacientes', 
						StockEnfermeriaLogicService.veTodosLosPacientes);

					if (StockEnfermeriaLogicService.veTodosLosPacientes) {
						// Busco todas las internaciones de la sucursal
						// Por back-end
						if (!StockEnfermeriaLogicService.internados) {
							scope.formControl.loading = true;
							UbicacionDataService.getAllInternacionesBySucursal(scope.data.usuario.sucursales[0].Id)
								.then(function (_internados) {
									$log.debug('internaciones', _internados);
									scope.data.internaciones = _internados;
									StockEnfermeriaLogicService.internados = _internados;
									scope.formControl.loading = false;
								});
						}
						// O por servicio si ya las busqué antes
						else {
							$log.debug('internaciones', StockEnfermeriaLogicService.internados);
							scope.data.internaciones = StockEnfermeriaLogicService.internados;
						}
					}
					else {
						scope.formControl.loading = false;
						cargarUbicacion();
					}
					scope.formControl.asignacion = true;

				}

			}
		}

	};

	return module;
})();