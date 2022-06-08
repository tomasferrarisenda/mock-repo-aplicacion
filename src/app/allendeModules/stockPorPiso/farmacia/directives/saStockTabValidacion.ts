/**
 * @author:			Martin Astore
 * @description:	Pestaña Ajuste de Farmacia
 * @type:			Directive
 **/
import template = require('../templates/sa-stock-tab-validacion.tpl.html');
import {
	IUbicacionDataService,
	IPedidoFarmaciaVentanillaDataService,
	IMaterialDataService,
	IDosificacionDataService,
	IAgregadoDataService,
	IPrescripcionDataService,
	IPedidoFarmaciaDataService,
	IStockCommonDataService
} from '../../common/services';
import { IStockFarmaciaModalService } from '../services';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saStockTabValidacion',saStockTabValidacion);

		saStockTabValidacion.$inject = ['$log', '$q', '$filter',
			'AlertaService', 'ModalService',
			'MaterialDataService', 'DosificacionDataService',
			'AgregadoDataService', 'PrescripcionDataService',
			'UbicacionDataService', 'PedidoFarmaciaVentanillaDataService',
			'PedidoFarmaciaDataService', 'StockCommonDataService',
			'StockFarmaciaModalService',
			'AdmisionDataService',
			'StockFarmaciaLogicService'];
		function saStockTabValidacion($log, $q, $filter,
			AlertaService: IAlertaService, ModalService: IModalService,
			MaterialDataService: IMaterialDataService, DosificacionDataService: IDosificacionDataService,
			AgregadoDataService: IAgregadoDataService, PrescripcionDataService: IPrescripcionDataService,
			UbicacionDataService: IUbicacionDataService, PedidoFarmaciaVentanillaDataService: IPedidoFarmaciaVentanillaDataService,
			PedidoFarmaciaDataService: IPedidoFarmaciaDataService, StockCommonDataService: IStockCommonDataService,
			StockFarmaciaModalService: IStockFarmaciaModalService,
			AdmisionDataService, StockFarmaciaLogicService) {

			return {
				restrict: 'E',
				scope: {
					title: '@?',
					carga: '&cargaOk',
					activate: '<'
					// model : '=?'
				},
				template: template,
				link: link
			};

			function link(scope) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					internaciones: [],
					estadosInternacion: [],
					pedidos: [],
					pacientesCargados: []					
				};

				scope.formData = {
					boton_fecha: '',
					productoNuevo: '',					
				};

				scope.formControl = {
					loading: false,
					ubicacionCargada: false,
					vacio: false,
					internacionCargada: false,
					guardia: false
				};

				scope.limpiar = limpiar;
				scope.ubicacionChanged = ubicacionChanged;
				scope.internacionChanged = internacionChanged;
				scope.pacienteChanged = pacienteChanged;
				scope.verDetalleDosificacion = verDetalleDosificacion;
				scope.verDetalleInfusion = verDetalleInfusion;
				scope.getPage = getPage;
				scope.changeBotonFecha = changeBotonFecha;
				scope.changeBotonTipo = changeBotonTipo;
				scope.verAgregados = verAgregados;
				scope.print = print;
				scope.entregar = entregar;
				scope.printEntrega = printEntrega;
				scope.entregarGuardia = entregarGuardia;
				scope.verDetalleGuardia = verDetalleGuardia;
				scope.nuevoProducto = nuevoProducto;
				scope.cargarProducto = cargarProducto;
				scope.suma = suma;
				scope.resta = resta;
				scope.entregarDescartables = entregarDescartables;
				scope.cambiarProductoDosif = cambiarProductoDosif;
				scope.cambiarProductoAgregado = cambiarProductoAgregado;

				scope.filter = {
					estadoDosificacion: '',
					internadoSeleccionado : null,

					// mètodo para botòn Limpiar filtros
					clean: function () {
						scope.filter.estado = 'Todos';
						scope.formControl.limpiar = true;
						// scope.formData.search = ''
					},
					// mètodo para que no valle el filtro de solicitudes
					validar: function () {

						if (scope.filter.estado == null) {
							scope.filter.estado = '';
						}
					}
				};

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function getPage() {
					$log.debug('Get Page ON', scope.filter.estadoDosificacion);
					scope.filter.validar();
					scope.filter.dosificaciones = $filter('filter')
						(scope.data.dosificaciones, {
							id_estado: scope.filter.estado.id_estado
						});
					$log.debug('filtro ', scope.filter.infusiones);
					scope.filter.infusiones = $filter('filter')
						(scope.data.infusiones, {
							id_estado: scope.filter.estado.id_estado
						});
					// scope.paginacion.totalItems = scope.filter.dosificaciones.length;
				}

				function ubicacionChanged(pUbicacion) {
					StockFarmaciaLogicService.facturacion = false;
					scope.formControl.internacionCargada = false;
					scope.formControl.guardia = false;
					scope.data.dosificaciones = [];
					scope.data.infusiones = [];
					getPage();
					scope.formData.internacion = '';
					scope.formData.paciente = '';
					if (pUbicacion) {
						if (pUbicacion.nombre_ubicacion_piso != 'Guardia') {
							scope.data.internaciones = [];
							scope.formControl.loading = true;
							UbicacionDataService.getInternacionesPorUbicacionOnly(pUbicacion.id_ubicacion, true)
								.then(function (_internaciones) {
									scope.data.ubicacion = pUbicacion;
									StockFarmaciaLogicService.ubicacionPiso = pUbicacion;
									scope.data.internaciones = _internaciones;
									scope.formControl.loading = false;
									scope.formControl.ubicacionCargada = true;
								}, function () {
									scope.formControl.loading = false;
								});
						}
						else {
							scope.formControl.guardia = true;
							scope.formData.paciente = '';
							PrescripcionDataService.getPacientesGuardia(pUbicacion.id_ubicacion)
								.then(function (pacientes) {
									scope.data.ubicacion = pUbicacion;
									scope.data.pacientesGuardia = pacientes;
									StockFarmaciaLogicService.ubicacionPiso = pUbicacion;
									scope.formControl.loading = false;
									scope.formControl.ubicacionCargada = true;
								});
						}
					}
					else {
						scope.formControl.ubicacionCargada = false;
					}
				}

				function internacionChanged() {
					scope.formData.boton_fecha = {
						nombre: 'Hoy',
						esHoy: true
					};
					scope.formData.boton_tipo = {
						nombre: 'Indicaciones',
						esIndicacion: true
					};
					scope.data.estados = scope.data.estadosDosificacion;
					if (scope.formData.internacion) {
						switchGet();
					}

					AdmisionDataService.getOneInternacionByNumeroParaStock(scope.formData.internacion.substring(0, 6))
						.then(function (internado) {							
							scope.filter.internadoSeleccionado = internado;
							// internado.NombreMutual
							// internado.NumeroAfiliado
							// internado.FechaAdmision | date:"dd/MM/yyyy HH:mm"
							// internado.Diagnostico
						}, function () {
							scope.filter.internadoSeleccionado = null;
						});
				}

				function pacienteChanged() {
					// var tieneCargados = false;
					// var existe = false;
					// var paciente = angular.copy(scope.formData.paciente);
					// var productos = [];

					// for (var i = 0; i < scope.formData.paciente.Pedidos.length; i++) {
					// 	for (var j = 0; j < scope.formData.paciente.Pedidos[i].Detalles.length; j++) {
					// 		if(scope.formData.paciente.Pedidos[i].Detalles[j].Cantidad > 0)
					// 		{
					// 			tieneCargados = true;
					// 			productos.push(scope.formData.paciente.Pedidos[i].Detalles[j]);
					// 		}
					// 	}
					// }
					// if(tieneCargados)
					// {
					// 	paciente.Productos = productos;
					// }

					// for (var k = 0; k < scope.data.pacientesCargados.length; k++) {
					// 	if(scope.data.pacientesCargados[k].Nombre == scope.formData.paciente.Nombre)
					// 	{
					// 		existe = true;
					// 		if(tieneCargados)
					// 			scope.data.pacientesCargados[k] = paciente;
					// 		else
					// 			scope.data.pacientesCargados.splice(k, 1);
					// 	}
					// }
					// if(!existe)
					// 	scope.data.pacientesCargados.push(paciente);
					for (var i = 0; i < scope.data.pacientesGuardia.length; i++) {
						if (scope.data.pacientesGuardia[i].Nombre == scope.formData.paciente.Nombre) {
							if (scope.data.pacientesGuardia[i].Pedidos)
								for (var j = 0; j < scope.data.pacientesGuardia[i].Pedidos.length; j++) {
									scope.data.pacientesGuardia[i].Pedidos[j].verDetalle = false;
									scope.data.pacientesGuardia[i].Pedidos[j].nuevoProducto = false;
								}
							scope.formData.paciente = scope.data.pacientesGuardia[i];
						}
					}

					$log.debug('scope.formData.paciente.', scope.formData.paciente);
					// scope.formData.paciente.Pedidos = [];
					if (!scope.formData.paciente.Pedidos) {
						scope.formControl.loading = true;
						if (scope.formData.paciente.IdPrescripcion) {
							PedidoFarmaciaDataService.getPedidosGuardiaByPrescripcion(scope.formData.paciente.IdPrescripcion)
								.then(function (pedidos) {
									// scope.formData.paciente.Pedidos = pedidos;
									scope.formData.paciente.Pedidos = pedidos;
									scope.formControl.loading = false;
									inicializarPedidos();
								});
						}
						else {
							PedidoFarmaciaDataService.getPedidosGuardiaByUbicacion(scope.data.ubicacion.id_ubicacion)
								.then(function (pedidos) {
									// scope.formData.paciente.Pedidos = pedidos;
									scope.formData.paciente.Pedidos = pedidos;
									scope.formControl.loading = false;
									inicializarPedidos();
								});
						}
					}
				}

				function inicializarPedidos() {
					for (var i = 0; i < scope.formData.paciente.Pedidos.length; i++) {
						for (var j = 0; j < scope.formData.paciente.Pedidos[i].Detalles.length; j++) {
							scope.formData.paciente.Pedidos[i].Detalles[j].Cantidad = 0;
							scope.formData.paciente.Pedidos[i].Detalles[j].minimo = true;
						}
					}
				}

				function changeBotonFecha() {
					if (scope.formData.boton_fecha.esHoy) {
						scope.formData.boton_fecha = {
							nombre: 'Todos',
							esHoy: false
						};
					}
					else {
						scope.formData.boton_fecha = {
							nombre: 'Hoy',
							esHoy: true
						};
					}
					switchGet();
				}

				function changeBotonTipo() {
					if (scope.formData.boton_tipo.esIndicacion) {
						scope.formData.boton_tipo = {
							nombre: 'Infusiones',
							esIndicacion: false
						};
						scope.data.estados = scope.data.estadosInfusion;
					}
					else {
						scope.formData.boton_tipo = {
							nombre: 'Indicaciones',
							esIndicacion: true
						};
						scope.data.estados = scope.data.estadosDosificacion;
					}
					switchGet();
				}

				function switchGet() {
					if (scope.formData.boton_tipo.esIndicacion && scope.formData.boton_fecha.esHoy) {
						getDosificacionesToday();
					}
					else if (scope.formData.boton_tipo.esIndicacion && !scope.formData.boton_fecha.esHoy) {
						getDosificaciones();
					}
					else if (!scope.formData.boton_tipo.esIndicacion && scope.formData.boton_fecha.esHoy) {
						getInfusionesToday();
					}
					else if (!scope.formData.boton_tipo.esIndicacion && !scope.formData.boton_fecha.esHoy) {
						getInfusiones();
					}
				}

				function getDosificaciones() {
					scope.data.dosificaciones = [];
					scope.formControl.loading = true;
					$log.debug('internacion', scope.formData.internacion);
					PedidoFarmaciaVentanillaDataService.getPedidosDosificacionByInternacion(scope.formData.internacion.substring(0, 6))
						.then(function (_dosificaciones) {
							scope.data.dosificaciones = _dosificaciones;
							rellenarDosificaciones();
							getPage();
							scope.formControl.loading = false;
							$log.debug('dosificaciones', scope.data.dosificaciones);
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function getDosificacionesToday() {
					scope.data.dosificaciones = [];
					scope.formControl.loading = true;
					$log.debug('internacion', scope.formData.internacion);
					PedidoFarmaciaVentanillaDataService.getPedidosDosificacionByInternacionToday(scope.formData.internacion.substring(0, 6))
						.then(function (_dosificaciones) {
							scope.data.dosificaciones = _dosificaciones;
							rellenarDosificaciones();
							getPage();
							scope.formControl.loading = false;
							scope.formControl.internacionCargada = true;
							$log.debug('dosificaciones', scope.data.dosificaciones);
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function getInfusiones() {
					scope.data.infusiones = [];
					scope.formControl.loading = true;
					$log.debug('internacion', scope.formData.internacion);
					AgregadoDataService.getInfusionesByInternacion(scope.formData.internacion.substring(0, 6))
						.then(function (_infusiones) {
							scope.data.infusiones = _infusiones;
							rellenarInfusiones();
							getPage();
							scope.formControl.loading = false;
							$log.debug('infusiones', scope.data.infusiones);
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function getInfusionesToday() {
					scope.data.infusiones = [];
					scope.formControl.loading = true;
					$log.debug('internacion', scope.formData.internacion);
					AgregadoDataService.getInfusionesByInternacionToday(scope.formData.internacion.substring(0, 6))
						.then(function (_infusiones) {
							scope.data.infusiones = _infusiones;
							rellenarInfusiones();
							getPage();
							scope.formControl.loading = false;
							$log.debug('infusiones', scope.data.infusiones);
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function rellenarDosificaciones() {
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						if (scope.data.dosificaciones[i].esHoy && scope.data.dosificaciones[i].cantidad_entregada == 0)
							scope.data.dosificaciones[i].puedeCambiarProducto = true;
						for (var j = 0; j < scope.data.materiales.length; j++) {
							if (scope.data.materiales[j].numero_articulo == scope.data.dosificaciones[i].numero_articulo) {
								scope.data.dosificaciones[i].Material = scope.data.materiales[j];
							}
						}
					}
				}

				function rellenarInfusiones() {
					for (var i = 0; i < scope.data.materiales.length; i++) {
						for (var j = 0; j < scope.data.infusiones.length; j++) {
							for (var k = 0; k < scope.data.infusiones[j].Agregados.length; k++) {
								if (scope.data.infusiones[j].esHoy && scope.data.infusiones[j].Agregados[k].cantidad_entregada == 0)
									scope.data.infusiones[j].Agregados[k].puedeCambiarProducto = true;
								if (scope.data.infusiones[j].Agregados[k].numero_articulo == scope.data.materiales[i].numero_articulo) {
									scope.data.infusiones[j].Agregados[k].Material = scope.data.materiales[i];
								}
							}
							if (scope.data.infusiones[j].Agregados.length == 0) {
								scope.data.infusiones[j].noAgregados = true;
							}
							scope.data.infusiones[j].verAgregados = false;
						}
					}
				}

				function verAgregados(pInfusion) {
					for (var i = 0; i < scope.data.infusiones.length; i++) {
						if (scope.data.infusiones[i].id_infusion == pInfusion.id_infusion) {
							scope.data.infusiones[i].verAgregados = !scope.data.infusiones[i].verAgregados;
						}
						else {
							scope.data.infusiones[i].verAgregados = false;
						}
					}
				}

				function verDetalleDosificacion(pDosificacion) {
					StockFarmaciaLogicService.dosificacion = pDosificacion;
					StockFarmaciaLogicService.internacion = scope.formData.internacion;
					StockFarmaciaModalService.viewDetalleDosificacion()
						.then(function () {
							$log.debug('verDetalleDosificacion OK');
							switchGet();
						});
				}

				function verDetalleInfusion(pInfusion) {
					StockFarmaciaLogicService.infusion = pInfusion;
					StockFarmaciaLogicService.internacion = scope.formData.internacion;
					StockFarmaciaModalService.viewDetalleInfusion()
						.then(function () {
							switchGet();
						});
				}

				function verDetalleGuardia(index) {
					var estado = scope.formData.paciente.Pedidos[index].verDetalle;
					for (var i = 0; i < scope.formData.paciente.Pedidos.length; i++) {
						scope.formData.paciente.Pedidos[i].verDetalle = false;
						scope.formData.paciente.Pedidos[i].nuevoProducto = false;
					}
					scope.formData.paciente.Pedidos[index].verDetalle = !estado;
				}

				function print() {
					StockFarmaciaModalService.printDosificacion();
				}

				function nuevoProducto(index) {
					scope.formData.productoNuevo = '';
					var estado = scope.formData.paciente.Pedidos[index].nuevoProducto;
					for (var i = 0; i < scope.formData.paciente.Pedidos.length; i++) {
						scope.formData.paciente.Pedidos[i].nuevoProducto = false;
					}
					scope.formData.paciente.Pedidos[index].nuevoProducto = !estado;
				}

				function cargarProducto(index) {
					$log.debug('producto', scope.formData.productoNuevo);
					if (!scope.formData.productoNuevo.id_material)
						return;

					for (var i = 0; i < scope.formData.paciente.Pedidos[index].Detalles.length; i++) {
						if (scope.formData.paciente.Pedidos[index].Detalles[i].Material.Id == scope.formData.productoNuevo.id_material) {
							scope.formData.paciente.Pedidos[index].nuevoProducto = false;
							scope.formData.productoNuevo = '';
							return;
						}
					}

					var detalle = {
						Material: {
							Id: scope.formData.productoNuevo.id_material,
							Nombre: scope.formData.productoNuevo.nombre,
							Presentacion: scope.formData.productoNuevo.presentacion,
							NumeroArticulo: scope.formData.productoNuevo.numero_articulo
						},
						Cantidad: 0
					};
					scope.formData.paciente.Pedidos[index].Detalles.push(detalle);
					scope.formData.paciente.Pedidos[index].nuevoProducto = false;
					scope.formData.productoNuevo = '';
				}

				function suma(pedido, detalle) {
					if (!pedido || !detalle)
						return;

					for (var i = 0; i < scope.formData.paciente.Pedidos.length; i++) {
						if (scope.formData.paciente.Pedidos[i].Id == pedido.Id) {
							for (var j = 0; j < scope.formData.paciente.Pedidos[i].Detalles.length; j++) {
								if (scope.formData.paciente.Pedidos[i].Detalles[j].Material.Id == detalle.Material.Id) {
									scope.formData.paciente.Pedidos[i].Detalles[j].Cantidad += 1;
									scope.formData.paciente.Pedidos[i].Detalles[j].minimo = false;
								}
							}
						}
					}
				}

				function resta(pedido, detalle) {
					if (!pedido || !detalle)
						return;

					for (var i = 0; i < scope.formData.paciente.Pedidos.length; i++) {
						if (scope.formData.paciente.Pedidos[i].Id == pedido.Id) {
							for (var j = 0; j < scope.formData.paciente.Pedidos[i].Detalles.length; j++) {
								if (scope.formData.paciente.Pedidos[i].Detalles[j].Material.Id == detalle.Material.Id) {
									scope.formData.paciente.Pedidos[i].Detalles[j].Cantidad -= 1;
								}
								if (scope.formData.paciente.Pedidos[i].Detalles[j].Cantidad == 0) {
									scope.formData.paciente.Pedidos[i].Detalles[j].minimo = true;
								}
							}
						}
					}
				}

				function entregar() {
					StockFarmaciaLogicService.ubicacion = scope.data.ubicacion;
					StockFarmaciaModalService.newEntrega()
						.then(function (pResult) {
							if (pResult) {
								scope.formControl.loading = true;
								MaterialDataService.getAllMateriales()
									.then(function (_materiales) {
										scope.data.materiales = _materiales;
										StockFarmaciaLogicService.materiales = _materiales;
										limpiar();
										scope.formControl.loading = false;
									}, function () {
										scope.formControl.loading = false;
									});
							}
							else {
								// limpiar();
							}
						});
				}

				function printEntrega() {
					StockFarmaciaLogicService.ubicacion = scope.data.ubicacion;
					StockFarmaciaLogicService.materiales = scope.data.materiales;
					StockFarmaciaLogicService.ubicacionPiso = scope.data.ubicacion;
					StockFarmaciaLogicService.estadoDosificacion = 102;
					StockFarmaciaModalService.printDosificacion();
				}

				function entregarGuardia() {

					StockFarmaciaLogicService.pacientesGuardia = scope.data.pacientesGuardia;
					StockFarmaciaLogicService.ubicacion = scope.data.ubicacion;
					StockFarmaciaModalService.newEntregaGuardia()
						.then(function (pResult) {
							if (pResult) {
								limpiar();
							}
							else {
								// limpiar();
							}
						});
				}

				function entregarDescartables() {
					StockFarmaciaLogicService.internacion = scope.formData.internacion;
					StockFarmaciaModalService.entregarDescartables()
						.then(function () {
							switchGet();
						});
				}

				function limpiar() {
					scope.formControl.ubicacionCargada = false;
					scope.formControl.limpiar = true;
					scope.formControl.internacionCargada = false;
					scope.formControl.guardia = false;
					scope.data.dosificaciones = [];
					scope.data.pedidos = [];
					scope.data.infusiones = [];
					scope.formData.internacion = '';
				}

				scope.$watch(function () {
					return scope.activate;
				}, function (newValue) {
					if (newValue) {
						limpiar();
						// scope.activate = false;
					}
				});

				function cambiarProductoDosif(dosificacion) {
					StockFarmaciaModalService.cambiarProducto(dosificacion.numero_articulo, dosificacion.droga)
						.then(function () {
							if (StockFarmaciaLogicService.nuevoProducto) {
								$log.debug("nuevo producto", StockFarmaciaLogicService.nuevoProducto);
								DosificacionDataService.cambiarProductoDosificacion(dosificacion.id_dosificacion, dosificacion.id_sucursal, StockFarmaciaLogicService.nuevoProducto.NumeroArticulo)
									.then(function (result) {										
										if(result.IsOk === true){
											AlertaService.NewSuccess("Producto Cambiado");
											switchGet();
										}
										else{
											if(result.Message != null) {
												ModalService.warning(result.Message);
											}else {
												ModalService.warning("Error no controlado");		
											}
										}
									})
							}
						})
				}

				function cambiarProductoAgregado(infusion, agregado) {
					StockFarmaciaModalService.cambiarProducto(agregado.numero_articulo, agregado.droga)
						.then(function () {
							if (StockFarmaciaLogicService.nuevoProducto) {
								$log.debug("nuevo producto", StockFarmaciaLogicService.nuevoProducto);
								AgregadoDataService.cambiarProductoAgregado(agregado.id_agregado, infusion.id_sucursal, StockFarmaciaLogicService.nuevoProducto.NumeroArticulo)
								.then(function (result) {										
									if(result.IsOk === true){
										AlertaService.NewSuccess("Producto Cambiado");
										switchGet();
									}
									else{
										if(result.Message != null) {
											ModalService.warning(result.Message);
										}else {
											ModalService.warning("Error no controlado");		
										}
									}
								})
							}
						})
				}
				
				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				activate();

				function activate() {
					$log.debug('saStockTabValidacion ON');
					scope.data.farmacia = StockFarmaciaLogicService.farmacia;
					scope.data.usuario = StockFarmaciaLogicService.usuario;
					scope.data.materiales = StockFarmaciaLogicService.materiales;
					var _estadosDosificacion = StockCommonDataService.getEstadosDosificacion();
					var _estadosInfusion = AgregadoDataService.getEstadoInfusion();
					var _estadosDosificacionHabilitados = StockCommonDataService.getEstadosDosificacionHabilitados();

					$q.all([_estadosDosificacion, _estadosInfusion, _estadosDosificacionHabilitados])
						.then(function (result) {
							scope.data.estadosDosificacion = result[0];
							scope.data.estadosInfusion = result[1];
							scope.data.estadosDosificacionHabilitados = result[2];
							StockFarmaciaLogicService.estadosDosificacion = scope.data.estadosDosificacionHabilitados;
							$log.debug('saStockTabValidacion OK', scope.data.estadosDosificacion);
						});
					scope.data.estadosInternacion = [
						{
							nombre: "Con pendientes",
							color: "color-amarillo"
						},
						{
							nombre: "Con alta",
							color: "color-rojo"
						}
					];
				}
			}
		}
	};

	return module;
})();