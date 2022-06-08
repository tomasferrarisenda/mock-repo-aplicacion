/**
 * @author:			Martin Astore
 * @description:	Pestaña Asignacion de Enfermeria
 * @type:			Directive
 **/
import listadoTemplate = require('./sa-stock-tab-listado.tpl.html');
import { IUbicacionDataService, IMovimientoStockDataService, IStockCommonDataService, IStockCommonLogicService } from '../../../common/services';
import { IStockEnfermeriaModalService } from '../../services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saStockTabListadoEnfermeria', saStockTabListadoEnfermeria);

		saStockTabListadoEnfermeria.$inject = ['$log', '$q', '$filter', 'ModalService',
			'UbicacionDataService', 'MovimientoStockDataService',
			'StockCommonDataService', 'StockCommonLogicService',
			'StockEnfermeriaModalService',
			'StockEnfermeriaLogicService', 'AlertaService'];
		function saStockTabListadoEnfermeria($log, $q, $filter, ModalService: IModalService,
			UbicacionDataService: IUbicacionDataService, MovimientoStockDataService: IMovimientoStockDataService,
			StockCommonDataService: IStockCommonDataService, StockCommonLogicService: IStockCommonLogicService,
			StockEnfermeriaModalService: IStockEnfermeriaModalService,
			StockEnfermeriaLogicService, AlertaService: IAlertaService) {
			return {
				restrict: 'E',
				scope: {
					title: '@?',
					activate: '='
					// model : '=?'
				},
				template: listadoTemplate,
				link: link
			};

			function link(scope, attrib, element) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */
				scope.today = new Date();
				
				scope.data = {
					internaciones: [],
					farmacia: '',
					usuarios: []
				};

				scope.formData = {

				};

				scope.formControl = {
					loading: false,
					supervisor: false
				};

				scope.filter = {
					producto: ''
				};

				scope.limpiar = limpiar;
				scope.pisoChanged = pisoChanged;
				scope.ubicacionChanged = ubicacionChanged;
				scope.cambiaFecha = cambiaFecha;
				scope.prestarEnfermera = prestarEnfermera;
				scope.filtroInternacion = filtroInternacion;
				scope.filtroMaterial = filtroMaterial;
				scope.esScrap = esScrap;
				scope.pendientes = pendientes;
				scope.mostrarDetalleMovimiento = mostrarDetalleMovimiento;
				scope.autorizarScrap = autorizarScrap;
				scope.cancelarMovimiento = cancelarMovimiento;

				scope.filter = {
					producto: '',
					movimientos: [],
					// tipoMovimiento: '', 
					usuario: '',
					internado: '',
					esScrap: '',
					pendientes: '',
					material: '',
					// mètodo para botòn Limpiar filtros
					clean: function () {
						// slc.filter.tipoMovimiento = '';
						scope.filter.usuario = '';
						scope.paginacion.pageChanged();
					},
					// mètodo para que no valle el filtro de solicitudes
					validar: function () {
						// if (slc.filter.tipoMovimiento==null) {
						//     slc.filter.tipoMovimiento = '';
						// }
						if (scope.filter.usuario == null) {
							scope.filter.usuario = '';
						}
						if (scope.filter.internado == null) {
							scope.filter.internado = '';
						}
						if (scope.filter.esScrap == null) {
							scope.filter.esScrap = '';
						}
						if (scope.filter.pendientes == null) {
							scope.filter.pendientes = '';
						}
						if (scope.filter.material == null) {
							scope.filter.material = false;
						}
					}
				};

				scope.paginacion = {
					currentPage: 0,
					pageSize: 0,
					totalItems: 0,
					pageChanged: function () {
						scope.paginacion.getPage();
					},
					getPage: function () {
						var begin = ((scope.paginacion.currentPage - 1) * scope.paginacion.pageSize);
						var end = begin + scope.paginacion.pageSize;
						scope.filter.validar();
						scope.filter.movimientos = $filter('filter')
							(scope.data.movimientos, {
								id_movimiento: scope.formData.id_movimiento,
								Usuario:
								{
									Id: scope.filter.usuario.Id
								},
								UbicacionHasta:
								{
									tipo_ubicacion: scope.filter.esScrap,
									numero_internado: scope.filter.internado.numero_internado
								},
								autorizado: scope.filter.pendientes,
								// cancelado : scope.filter.pendientes,
								material: scope.filter.material,
								oculto: false
								// cancelado : slc.filter.pendientes,
								// Agregar los filters restantes
							});
						scope.paginacion.totalItems = scope.filter.movimientos.length;
						scope.filter.movimientos = scope.filter.movimientos.slice(begin, end);
						if (scope.filter.movimientos[0] == null && scope.data.ubicacion != '') {
							scope.formControl.vacio = true;
						}
						else {
							scope.formControl.vacio = false;
						}
					}
				};

				function cambiaFecha() {
					$log.debug('fechadesde despues', scope.formData.fecha_desde);
					$log.debug('fechahasta antes', scope.formData.fecha_hasta);
					// if ((scope.formData.fecha_hasta - scope.formData.fecha_desde) > 172900000 ||
					// 	scope.formData.fecha_desde > scope.formData.fecha_hasta) {
					// 	scope.formData.fecha_hasta = new Date(scope.formData.fecha_desde + 172900000);
					// }
					// $log.debug('fechahasta despues', scope.formData.fecha_hasta);
					scope.formData.fecha_hasta = StockCommonLogicService
						.getFechaHastaByDesde(scope.formData.fecha_desde, scope.formData.fecha_hasta);

					scope.data.fecha_desde = $filter('date')(scope.formData.fecha_desde, 'MM/dd/yyyy');
					scope.data.fecha_hasta = $filter('date')(scope.formData.fecha_hasta, 'MM/dd/yyyy');
					scope.formControl.fecha_cambiada = true;
					getMovimientosPorUbicacion();
				}

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function pisoChanged() {
					scope.formControl.vacio = false;
					scope.data.ubicacion = null;
					$log.debug('EnfermeriaController: getUbicacionPorPiso ON.-');
					if (scope.data.piso != scope.formData.piso) {
						scope.formControl.ubicacionCargada = false;
						scope.filter.ubicacionesDetalle = [];
						if (scope.formData.piso != null) {
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
					scope.filter.movimientos = [];
					scope.data.ubicacionesDetalle = [];
					scope.data.movimientosFiltrados = [];
					scope.filter.ubicacionesDetalle = [];
					scope.formControl.ubicacionCargada = false;

					if (scope.formData.ubicacion && scope.formData.ubicacion != '' && scope.formData.piso != null) {
						scope.formControl.ubicacionCargada = true;
						scope.data.ubicacion = scope.formData.ubicacion;
						getMovimientosPorUbicacion();
					}
					else {
						scope.formControl.internado = false;
					}
				}

				function getMovimientosPorUbicacion() {
					$log.debug('EnfermeriaController: getMovimientosPorUbicacion ON.-');
					if (scope.data.ubicacion != '') {
						scope.formControl.loading = true;
						var _object = {};
						_object['id_ubicacion'] = scope.data.ubicacion.id_ubicacion;
						_object['fecha_desde'] = scope.data.fecha_desde;
						_object['fecha_hasta'] = scope.data.fecha_hasta;

						UbicacionDataService.getAllMovimientoByUbicacionAndFechas(_object)
							.then(function (pMovimientos) {
								scope.data.movimientos = pMovimientos;
								llenarMovimientos();
								scope.formControl.fecha_cambiada = false;
								$log.debug('EnfermeriaController: getMovimientosPorUbicacion OK.-', pMovimientos);
							}, function () {
								scope.formControl.loading = false;
							});
					};
				}

				function llenarMovimientos() {
					$log.debug('EnfermeriaController: getAllUbicacionesPiso ON.-');
					var existe;
					scope.data.usuarios = [];
					scope.data.ubicacionesInternado = [];
					if (scope.data.movimientos != '' && scope.data.movimientos[0].UbicacionDesde) {

						for (var i = 0; i < scope.data.movimientos.length; i++) {
							existe = false;
							for (var j = 0; j < scope.data.usuarios.length; j++) {
								if (scope.data.usuarios[j].Id == scope.data.movimientos[i].id_usuario_alta) {
									existe = true;
								}
							}
							if (!existe) {
								scope.data.usuarios.push(scope.data.movimientos[i].Usuario)
							}
							var _fecha = new Date(scope.data.movimientos[i].fecha_alta);
							_fecha.setHours(0);
							_fecha.setMinutes(0);
							_fecha.setSeconds(0);
							_fecha.setMilliseconds(0);
							scope.data.movimientos[i].fecha = _fecha;
							scope.data.movimientos[i].material = false;
							scope.data.movimientos[i].oculto = false;

							if (scope.data.movimientos[i].id_tipo_movimiento == 4 || scope.data.movimientos[i].id_tipo_movimiento > 6)
								scope.data.movimientos[i].oculto = true;

							//Mostrar Ubicacion Desde
							switch (scope.data.movimientos[i].UbicacionDesde.tipo_ubicacion) {
								case 1: //PISO
									for (var j = 0; j < scope.data.ubicacionesPiso.length; j++) {
										if (scope.data.ubicacionesPiso[j].id_ubicacion == scope.data.movimientos[i].UbicacionDesde.id_ubicacion) {
											scope.data.movimientos[i].UbicacionDesde.nombre = scope.data.ubicacionesPiso[j]
												.nombre_ubicacion_piso;
											scope.data.movimientos[i].tipoMovimiento = "Egreso";
											var todosCancelados = true;
											for (var k = 0; k < scope.data.movimientos[i].DetallesMovimiento.length; k++) {
												if (scope.data.movimientos[i].DetallesMovimiento[k].id_estado_movimiento_detalle == 51) {
													scope.data.movimientos[i].DetallesMovimiento[k].facturado = true;
													scope.data.movimientos[i].facturado = true;
												}
												if (scope.data.movimientos[i].DetallesMovimiento[k].id_estado_movimiento_detalle == 61) {
													scope.data.movimientos[i].DetallesMovimiento[k].cancelado = true;
												}
												else {
													todosCancelados = false;
												}
											}
											if (scope.data.movimientos[i].id_estado_movimiento == 72 || todosCancelados) {
												scope.data.movimientos[i].cancelado = true;
												scope.data.movimientos[i].autorizado = true;
												for (var k = 0; k < scope.data.movimientos[i].DetallesMovimiento.length; k++) {
													scope.data.movimientos[i].DetallesMovimiento[k].cancelado = true;
												}
											}

										}
									};
									break;

								case 2: //FARMACIA
									scope.data.movimientos[i].UbicacionDesde.nombre = scope.data.farmacia.nombre;
									scope.data.movimientos[i].tipoMovimiento = "Ingreso";
									scope.data.movimientos[i].UbicacionDesde.farmacia = true;
									scope.data.movimientos[i].autorizado = true;

									break;

								case 6: //PISO Guardia
									for (var j = 0; j < scope.data.ubicacionesPiso.length; j++) {
										if (scope.data.ubicacionesPiso[j].id_ubicacion == scope.data.movimientos[i].UbicacionDesde.id_ubicacion) {
											scope.data.movimientos[i].UbicacionDesde.nombre = scope.data.ubicacionesPiso[j]
												.nombre_ubicacion_piso;
											scope.data.movimientos[i].tipoMovimiento = "Egreso";
										}
									}
									break;
							}

							//Mostrar Ubicacion Hasta
							switch (scope.data.movimientos[i].UbicacionHasta.tipo_ubicacion) {

								case 1: //PISO
									for (var j = 0; j < scope.data.ubicacionesPiso.length; j++) {
										if (scope.data.ubicacionesPiso[j].id_ubicacion == scope.data.movimientos[i]
											.UbicacionHasta.id_ubicacion) {

											scope.data.movimientos[i].UbicacionHasta.nombre = scope.data.ubicacionesPiso[j]
												.nombre_ubicacion_piso;
										}
									}
									break;

								case 3: //PACIENTE
									scope.data.movimientos[i].autorizado = true;
									scope.data.ubicacionesInternado.push(scope.data.movimientos[i].id_ubicacion_hasta);
									// cargarInternado(i);
									break;

								case 4: //SCRAP
									scope.data.movimientos[i].UbicacionHasta.nombre = "Scrap";
									scope.data.movimientos[i].UbicacionHasta.scrapEnfermera = true;
									scope.data.movimientos[i].UbicacionHasta.scrap = true;
									if (scope.data.movimientos[i].id_estado_movimiento == 48 ||
										scope.data.movimientos[i].id_estado_movimiento == 50 ||
										scope.data.movimientos[i].id_estado_movimiento == 72) {
										scope.data.movimientos[i].autorizado = true;
									}
									else {
										scope.data.movimientos[i].autorizado = false;
									}
									break;

								case 5: //SCRAP
									scope.data.movimientos[i].UbicacionHasta.nombre = "Scrap";
									scope.data.movimientos[i].UbicacionHasta.scrapTraslado = true;
									scope.data.movimientos[i].UbicacionHasta.scrap = true;
									scope.data.movimientos[i].autorizado = true;
									scope.data.movimientos[i].facturado = true;
									break;

								case 6: //PISO Guardia
									for (var j = 0; j < scope.data.ubicacionesPiso.length; j++) {
										if (scope.data.ubicacionesPiso[j].id_ubicacion == scope.data.movimientos[i]
											.UbicacionHasta.id_ubicacion) {

											scope.data.movimientos[i].UbicacionHasta.nombre = scope.data.ubicacionesPiso[j]
												.nombre_ubicacion_piso;
										}
									}
									if (scope.data.movimientos[i].id_estado_movimiento == 50) {
										scope.data.movimientos[i].autorizado = true;
									}
									else {
										scope.data.movimientos[i].autorizado = false;
									}
									break;
							}
						}
						$log.debug('EnfermeriaController: getAllUbicacionesPiso OK.-');
						cargarInternados();
					}
					else {
						scope.formControl.error = false;
						scope.formControl.loading = false;
						scope.filter.movimientos = [];
					}
				}

				function cargarInternados() {
					$log.debug('ubicacionesInternado', scope.data.ubicacionesInternado);
					var lista = {};
					lista['lista'] = scope.data.ubicacionesInternado;
					if (scope.data.ubicacionesInternado.length > 0) {
						UbicacionDataService.getInternadosByUbicacionInternado(lista)
							.then(function (pInternados) {
								for (var i = 0; i < scope.data.movimientos.length; i++) {
									for (var j = 0; j < pInternados.length; j++) {
										if (pInternados[j].id_ubicacion_internado == scope.data.movimientos[i].UbicacionHasta.id_ubicacion) {
											scope.data.movimientos[i].UbicacionHasta.id = pInternados[j].numero_internado;
											scope.data.movimientos[i].UbicacionHasta.nombre = pInternados[j].nombre_paciente;
											scope.data.movimientos[i].UbicacionHasta.numero_internado = pInternados[j].numero_internado;
										}
									}
								}
								scope.paginacion.currentPage = 1;
								scope.paginacion.pageSize = 10;
								scope.paginacion.getPage();
								scope.formControl.loading = false;
								scope.formControl.internado = true;
							}, function () {
								scope.formControl.loading = false;
							});
					}
					else {
						scope.paginacion.currentPage = 1;
						scope.paginacion.pageSize = 10;
						scope.paginacion.getPage();
						scope.formControl.loading = false;
						scope.formControl.internado = true;
					}
				}

				// function cargarInternado (i) {
				// 	var existe = false;
				// 	for (var j = 0; j < scope.data.internaciones.length; j++) {
				// 	if(scope.data.internaciones[j].id_ubicacion_internado == scope.data.movimientos[i].UbicacionHasta.id_ubicacion)
				// 	{
				// 		existe = true;
				// 		$log.debug('internacionJ',scope.data.internaciones[j]);
				// 		scope.data.movimientos[i].UbicacionHasta.id = scope.data.internaciones[j].numero_internado;
				// 		scope.data.movimientos[i].UbicacionHasta.nombre = scope.data.internaciones[j].nombre_paciente;
				// 		scope.data.movimientos[i].UbicacionHasta.numero_internado = scope.data.internaciones[j].numero_internado;
				// 	}
				// }

				// if(!existe) //completar internados de alta
				// {
				// 	UbicacionDataService.getInternadoByIdUbicacion(scope.data.movimientos[i].UbicacionHasta.id_ubicacion)
				// 		.then(function (pInternado) {
				// 			if(pInternado)
				// 			{
				// 				scope.data.internaciones.push(pInternado);
				// 				scope.data.movimientos[i].UbicacionHasta.id = pInternado.numero_internado;
				// 				scope.data.movimientos[i].UbicacionHasta.nombre = pInternado.nombre_paciente;
				// 				scope.data.movimientos[i].UbicacionHasta.numero_internado = pInternado.numero_internado;
				// 				scope.data.movimientos[i].autorizado = true;
				// 				$log.debug('EnfermeriaController: GetInternadoByIdUbicacion OK.-',pInternado);
				// 			}
				// 	},function (pError) {
				// 		scope.formControl.loading = false;
				// 		$log.error('EnfermeriaController: GetInternadoByIdUbicacion ERROR.-', pError);
				// 	})
				// }
				// }

				function mostrarDetalleMovimiento(pMovimiento) {
					$log.debug('EnfermeriaController: GetMovimientoDetallePorMovimiento ON.-', pMovimiento);
					StockEnfermeriaLogicService.movimiento = StockCommonLogicService
						.materialesPorMovimiento(pMovimiento, scope.data.materiales);
					StockEnfermeriaLogicService.materiales = scope.data.materiales;
					// StockEnfermeriaLogicService.supervisor = scope.formControl.supervisor;
					StockEnfermeriaModalService.viewDetalle(pMovimiento).then(function () {
						if (!pMovimiento.UbicacionDesde.farmacia) {
							cambiaFecha();
						}
					});
				}

				function autorizarScrap(pMovimiento) {

					StockEnfermeriaLogicService.movimiento = pMovimiento;
					StockEnfermeriaModalService.autorizarScrap()
						.then(function () {
							ubicacionChanged();
						});
				}

				function cancelarMovimiento(pMovimiento) {
					ModalService.confirm("¿Desea cancelar el movimiento?",
						function (argument) {
							if (argument) {
								scope.formControl.loading = true;
								MovimientoStockDataService.cancelarMovimiento(pMovimiento.id_movimiento)
									.then(function () {
										AlertaService.NewSuccess("Movimiento Cancelado");
										ubicacionChanged();
									}, function () {
										scope.formControl.loading = false;
									});
							}
						});
				}

				function filtroInternacion() {
					if (scope.formData.internacion.numero_internado != undefined) {
						scope.filter.internado = scope.formData.internacion;
					}
					else {
						scope.filter.internado = '';
					}
					scope.paginacion.pageChanged();
				}

				function filtroMaterial() {
					if (scope.formData.material.id_producto != undefined) {
						scope.filter.material = true;
						for (var i = 0; i < scope.data.movimientos.length; i++) {
							scope.data.movimientos[i].material = false;
							for (var j = 0; j < scope.data.movimientos[i].DetallesMovimiento.length; j++) {
								if (scope.data.movimientos[i].DetallesMovimiento[j].id_producto == scope.formData.material.id_producto) {
									scope.data.movimientos[i].material = true;
								}
							}
						}
					}
					else {
						scope.filter.material = false;
						for (var i = 0; i < scope.data.movimientos.length; i++) {
							scope.data.movimientos[i].material = false;
						}
					}
					scope.paginacion.pageChanged();
				}

				function esScrap() {
					if (scope.formData.esScrap) {
						scope.filter.esScrap = 4;
					}
					else {
						scope.filter.esScrap = '';
					}
					scope.paginacion.pageChanged();
				}

				function pendientes() {
					if (scope.formData.pendientes) {
						scope.filter.pendientes = false;
					}
					else {
						scope.filter.pendientes = '';
					}
					scope.paginacion.pageChanged();
				}

				function prestarEnfermera() {
					StockEnfermeriaModalService.asignarEnfermera();
				}

				function limpiar() {
					scope.formControl.limpiar = true;
					scope.formControl.loading = false;
					scope.data.ubicacion = '';
					scope.formData.piso = '';
					scope.formData.ubicacion = '';
					scope.filter.producto = '';
					scope.filter.esScrap = '';
					scope.filter.pendientes = '';
					scope.filter.usuario = '';
					scope.filter.internado = '';
					scope.formData.esScrap = false;
					scope.formData.pendientes = false;
					scope.formData.search = '';
					scope.formData.material = '';
					scope.data.ubicacionesDetalle = [];
					scope.data.movimientos = [];
					scope.filter.movimientos = [];
					scope.formData.tipoUbicacion = scope.data.tiposUbicacion[0];
					scope.paginacion.pageChanged();
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
					scope.data.pisos = StockEnfermeriaLogicService.pisos;
					scope.data.ubicacionesPiso = StockEnfermeriaLogicService.ubicacionesPiso;
					scope.data.usuario = StockEnfermeriaLogicService.usuario;
					scope.data.materiales = StockEnfermeriaLogicService.materiales;
					scope.data.tiposUbicacion = StockEnfermeriaLogicService.tiposUbicacion;
					scope.formData.tipoUbicacion = scope.data.tiposUbicacion[0];
					// scope.formControl.supervisor = StockEnfermeriaLogicService.supervisor;
					var _farmacia = StockCommonDataService.getFarmaciaByEdificio(scope.data.usuario.sucursales[0].Id);
					scope.formControl.puedeAutorizar = StockEnfermeriaLogicService.puedeAutorizar;
					var _internados;

					if (StockEnfermeriaLogicService.veTodosLosPacientes && StockEnfermeriaLogicService.internados) {
						_internados = StockEnfermeriaLogicService.internados;
					}
					else {
						_internados = UbicacionDataService.getAllInternacionesBySucursal(scope.data.usuario.sucursales[0].Id);
					}

					$q.all([_farmacia, _internados])
						.then(function (pResult) {
							scope.data.farmacia = pResult[0].Farmacia;
							scope.data.internaciones = pResult[1];
							StockEnfermeriaLogicService.internados = scope.data.internaciones;
							scope.formData.fecha_hasta = new Date();
							scope.formData.fecha_desde = new Date(Date.now() - 172800000);
							scope.data.fecha_desde = $filter('date')(scope.formData.fecha_desde, 'MM/dd/yyyy');
							scope.data.fecha_hasta = $filter('date')(scope.formData.fecha_hasta, 'MM/dd/yyyy');
							scope.formControl.error = false;
							scope.formControl.loading = false;
							$log.debug('EnfermeriaController: inicializarListado OK.-', pResult);
						}, function () {
							scope.formControl.loading = false;
						});
				}
			}
		}
	};

	return module;
})();