/**
 * @author:			Martin Astore
 * @description:	Pestaña Ajuste de Farmacia
 * @type:			Directive
 **/
import template = require( '../templates/sa-stock-tab-facturacion.tpl.html');
import { IMovimientoStockDataService, IDosificacionDataService, IAgregadoDataService, IStockCommonDataService } from '../../common/services';
import { IStockFarmaciaModalService } from '../services';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saStockTabFacturacion', saStockTabFacturacion);

		saStockTabFacturacion.$inject = ['$log', '$q', '$filter',
			'AlertaService',
			'MovimientoStockDataService', 'DosificacionDataService',
			'AgregadoDataService', 'StockCommonDataService',
			'StockFarmaciaModalService', 'AdmisionDataService',
			'StockFarmaciaLogicService'];
		function saStockTabFacturacion($log, $q, $filter,
			AlertaService: IAlertaService,
			MovimientoStockDataService: IMovimientoStockDataService, DosificacionDataService: IDosificacionDataService,
			AgregadoDataService: IAgregadoDataService, StockCommonDataService: IStockCommonDataService,
			StockFarmaciaModalService: IStockFarmaciaModalService,
			AdmisionDataService, StockFarmaciaLogicService) {

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
					internaciones: []
				};

				scope.formData = {
					boton_fecha: ''
				};

				scope.formControl = {
					loading: false,
					ubicacionCargada: false,
					vacio: false,
					internacionCargada: false,
					hayCambios: false,
					enfermeria: false
				};

				scope.limpiar = limpiar;
				scope.internacionChanged = internacionChanged;
				// scope.verDetalleDosificacion = verDetalleDosificacion;
				// scope.verDetalleInfusion = verDetalleInfusion;
				scope.getPage = getPage;
				// scope.changeBotonFecha = changeBotonFecha;
				// scope.changeBotonTipo = changeBotonTipo;
				scope.verAgregados = verAgregados;
				scope.verTomas = verTomas;
				scope.print = print;
				// scope.entregar = entregar;
				scope.viewFacturado = viewFacturado;
				scope.getInternacionesPendientes = getInternacionesPendientes;

				scope.facturarToma = facturarToma;
				scope.devolucionToma = devolucionToma;
				scope.facturarDesca = facturarDesca;
				scope.devolucionDesca = devolucionDesca;
				scope.facturarAgregado = facturarAgregado;
				scope.devolucionAgregado = devolucionAgregado;

				scope.guardar = guardar;

				scope.filter = {
					estadoDosificacion: '',
					internadoSeleccionado : null,
					fechaAltaMedica : '',
					// mètodo para botòn Limpiar filtros
					clean: function () {
						scope.filter.estado = 'Todos';
						scope.formControl.limpiar = true;
						// scope.formData.search = ''

						getPage();
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

				function getInternacionesPendientes() {
					scope.formControl.loading = true;
					limpiar();
					MovimientoStockDataService.getInternacionesPendientesBySucursal(StockFarmaciaLogicService.sucursal.Id)
						.then(function (_internaciones) {
							scope.data.internacionesPendientes = _internaciones;
							for (var i = 0; i < scope.data.internacionesPendientes.length; i++) {
								scope.data.internacionesPendientes[i].numero_internado = scope.data.internacionesPendientes[i].NumeroInternado;
							}
							scope.formControl.loading = false;
							// limpiar();
						});
				}


				function internacionChanged() {
					$log.debug('internacion', scope.formData.internacion);
					StockFarmaciaLogicService.facturacion = true;
					scope.formControl.internacionCargada = true;
					scope.formControl.hayCambios = false;
					if (scope.formData.internacion) {
						scope.data.dosificaciones = [];
						scope.data.infusiones = [];

						MovimientoStockDataService.getPendientesByInternado(scope.formData.internacion.NumeroInternado)
							.then(function (pendientes) {
								scope.data.pendientes = pendientes;
								$log.debug('pendientes', pendientes);
								for (var i = 0; i < scope.data.pendientes.length; i++) {
									if (scope.data.pendientes[i].IdTipo == 1) {
										scope.data.dosificaciones.push(scope.data.pendientes[i]);
									}
									else if (scope.data.pendientes[i].IdTipo == 2) {
										scope.data.infusiones.push(scope.data.pendientes[i]);
									}
								}
								rellenarDosificaciones();
								rellenarInfusiones();
								scope.formControl.vacio = !scope.formControl.hayDosificaciones && !scope.formControl.hayInfusiones;
							});

						AdmisionDataService.getOneInternacionByNumeroParaStock(scope.formData.internacion.NumeroInternado)
							.then(function (internado) {							
								scope.filter.internadoSeleccionado = internado;
								if(internado.FechaAltaMedica != null) {
									scope.filter.fechaAltaMedica = internado.FechaAltaMedica;
								} else {
									scope.filter.fechaAltaMedica = 'Sin Alta';
								}
								
								// internado.NombreMutual
								// internado.NumeroAfiliado
								// internado.FechaAdmision | date:"dd/MM/yyyy HH:mm"
								// internado.Diagnostico
							}, function () {
								scope.filter.internadoSeleccionado = null;
								scope.filter.fechaAltaMedica = '';
							});	
					}
				}

				function rellenarDosificaciones() {
					scope.formControl.hayDosificaciones = false;
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						scope.formControl.hayDosificaciones = true;
						for (var j = 0; j < scope.data.materiales.length; j++) {
							if (scope.data.materiales[j].numero_articulo == scope.data.dosificaciones[i].NumeroArticulo) {
								scope.data.dosificaciones[i].Material = scope.data.materiales[j];
							}
						}
						scope.data.dosificaciones[i].verTomas = false;
						for (var j = 0; j < scope.data.dosificaciones[i].Detalles.length; j++) {
							scope.data.dosificaciones[i].Detalles[j].newFacturacion = false;
							scope.data.dosificaciones[i].Detalles[j].newDevolucion = false;
							if (scope.data.dosificaciones[i].Detalles[j].Estado == "Facturado" ||
								scope.data.dosificaciones[i].Detalles[j].Estado == "Suministrado") {
								scope.data.dosificaciones[i].Detalles[j].deshabilitado = true;
								scope.data.dosificaciones[i].Detalles[j].facturado = true;
							}
							if (scope.data.dosificaciones[i].Detalles[j].Estado == "Devuelto") {
								scope.data.dosificaciones[i].Detalles[j].deshabilitado = true;
								scope.data.dosificaciones[i].Detalles[j].devuelto = true;
							}
							if (scope.data.dosificaciones[i].Detalles[j].CantidadEntregada == 0) {
								scope.data.dosificaciones[i].Detalles[j].noEntregados = true;
							}
						}
						if (!scope.data.dosificaciones[i].Descartables)
							scope.data.dosificaciones[i].Descartables = [];
						for (var j = 0; j < scope.data.dosificaciones[i].Descartables.length; j++) {
							for (var k = 0; k < scope.data.materiales.length; k++) {
								if (scope.data.materiales[k].numero_articulo == scope.data.dosificaciones[i].Descartables[j].NumeroArticulo)
									scope.data.dosificaciones[i].Descartables[j].Material = scope.data.materiales[k];
							}
							scope.data.dosificaciones[i].hayDescartables = true;
							scope.data.dosificaciones[i].Descartables[j].newFacturacion = false;
							scope.data.dosificaciones[i].Descartables[j].newDevolucion = false;
							if (scope.data.dosificaciones[i].Descartables[j].Estado == "Facturado" ||
								scope.data.dosificaciones[i].Descartables[j].Estado == "Suministrado") {
								scope.data.dosificaciones[i].Descartables[j].deshabilitado = true;
								scope.data.dosificaciones[i].Descartables[j].facturado = true;
							}
							if (scope.data.dosificaciones[i].Descartables[j].Estado == "Devuelto") {
								scope.data.dosificaciones[i].Descartables[j].deshabilitado = true;
								scope.data.dosificaciones[i].Descartables[j].devuelto = true;
							}
							if (scope.data.dosificaciones[i].Descartables[j].CantidadEntregada == 0) {
								scope.data.dosificaciones[i].Descartables[j].noEntregados = true;
							}
						}
					}
				}

				function rellenarInfusiones() {
					scope.formControl.hayInfusiones = false;
					for (var j = 0; j < scope.data.infusiones.length; j++) {
						scope.formControl.hayInfusiones = true;
						for (var k = 0; k < scope.data.infusiones[j].Detalles.length; k++) {
							for (var i = 0; i < scope.data.materiales.length; i++) {
								if (scope.data.infusiones[j].Detalles[k].NumeroArticulo == scope.data.materiales[i].numero_articulo) {
									scope.data.infusiones[j].Detalles[k].Material = scope.data.materiales[i];
								}
							}
							scope.data.infusiones[j].Detalles[k].newFacturacion = false;
							scope.data.infusiones[j].Detalles[k].newDevolucion = false;
							if (scope.data.infusiones[j].Detalles[k].Estado == "Entregado" ||
								scope.data.infusiones[j].Detalles[k].Estado == "Suspendido") {
								scope.data.infusiones[j].Detalles[k].deshabilitado = true;
							}
							if (scope.data.infusiones[j].Detalles[k].Estado == "Facturado") {
								scope.data.infusiones[j].Detalles[k].deshabilitado = true;
								scope.data.infusiones[j].Detalles[k].facturado = true;
							}
							if (scope.data.infusiones[j].Detalles[k].Estado == "Devuelto") {
								scope.data.infusiones[j].Detalles[k].deshabilitado = true;
								scope.data.infusiones[j].Detalles[k].devuelto = true;
							}
							if (scope.data.infusiones[j].Detalles[k].CantidadEntregada == 0) {
								scope.data.infusiones[j].Detalles[k].noEntregados = true;
							}
						}
						if (scope.data.infusiones[j].Detalles.length == 0) {
							scope.data.infusiones[j].noAgregados = true;
						}
						scope.data.infusiones[j].verAgregados = false;
					}
				}

				function verAgregados(pInfusion) {
					for (var i = 0; i < scope.data.infusiones.length; i++) {
						if (scope.data.infusiones[i].Id == pInfusion.Id) {
							scope.data.infusiones[i].verAgregados = !scope.data.infusiones[i].verAgregados;
						}
						else {
							scope.data.infusiones[i].verAgregados = false;
						}
					}
				}

				function verTomas(pDosificacion) {
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						if (scope.data.dosificaciones[i].Id == pDosificacion.Id) {
							scope.data.dosificaciones[i].verTomas = !scope.data.dosificaciones[i].verTomas;
						}
						else {
							scope.data.dosificaciones[i].verTomas = false;
						}
					}
				}

				function viewFacturado() {
					StockFarmaciaLogicService.internacion = scope.formData.internacion;
					StockFarmaciaModalService.viewFacturado()
						.then(function () {
							// TODO: ver esto
						});
				}

				function facturarToma(pDosif, pToma) {
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						if (scope.data.dosificaciones[i].Id == pDosif.Id)
							for (var j = 0; j < scope.data.dosificaciones[i].Detalles.length; j++) {
								if (scope.data.dosificaciones[i].Detalles[j].Id == pToma.Id)
									scope.data.dosificaciones[i].Detalles[j].newFacturacion =
										!scope.data.dosificaciones[i].Detalles[j].newFacturacion;
							}
					}
					verCambios();
				}

				function devolucionToma(pDosif, pToma) {
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						if (scope.data.dosificaciones[i].Id == pDosif.Id)
							for (var j = 0; j < scope.data.dosificaciones[i].Detalles.length; j++) {
								if (scope.data.dosificaciones[i].Detalles[j].Id == pToma.Id)
									scope.data.dosificaciones[i].Detalles[j].newDevolucion =
										!scope.data.dosificaciones[i].Detalles[j].newDevolucion;
							}
					}
					verCambios();
				}

				function facturarDesca(pDosif, pToma) {
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						if (scope.data.dosificaciones[i].Id == pDosif.Id)
							for (var j = 0; j < scope.data.dosificaciones[i].Descartables.length; j++) {
								if (scope.data.dosificaciones[i].Descartables[j].Id == pToma.Id)
									scope.data.dosificaciones[i].Descartables[j].newFacturacion =
										!scope.data.dosificaciones[i].Descartables[j].newFacturacion;
							}
					}
					verCambios();
				}

				function devolucionDesca(pDosif, pToma) {
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						if (scope.data.dosificaciones[i].Id == pDosif.Id)
							for (var j = 0; j < scope.data.dosificaciones[i].Descartables.length; j++) {
								if (scope.data.dosificaciones[i].Descartables[j].Id == pToma.Id)
									scope.data.dosificaciones[i].Descartables[j].newDevolucion =
										!scope.data.dosificaciones[i].Descartables[j].newDevolucion;
							}
					}
					verCambios();
				}

				function facturarAgregado(pInfu, pAgregado) {
					for (var i = 0; i < scope.data.infusiones.length; i++) {
						if (scope.data.infusiones[i].Id == pInfu.Id)
							for (var j = 0; j < scope.data.infusiones[i].Detalles.length; j++) {
								if (scope.data.infusiones[i].Detalles[j].Id == pAgregado.Id)
									scope.data.infusiones[i].Detalles[j].newFacturacion =
										!scope.data.infusiones[i].Detalles[j].newFacturacion;
							}
					}
					verCambios();
				}

				function devolucionAgregado(pInfu, pAgregado) {
					for (var i = 0; i < scope.data.infusiones.length; i++) {
						if (scope.data.infusiones[i].Id == pInfu.Id)
							for (var j = 0; j < scope.data.infusiones[i].Detalles.length; j++) {
								if (scope.data.infusiones[i].Detalles[j].Id == pAgregado.Id)
									scope.data.infusiones[i].Detalles[j].newDevolucion =
										!scope.data.infusiones[i].Detalles[j].newDevolucion;
							}
					}
					verCambios();
				}

				function guardar() {
					var _llamadas: Array<any> = [];
					var _hayCambios = false;
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						for (var j = 0; j < scope.data.dosificaciones[i].Detalles.length; j++) {
							if (scope.data.dosificaciones[i].Detalles[j].newFacturacion) {
								_llamadas.push(DosificacionDataService
									.facturarToma(scope.data.dosificaciones[i].Detalles[j].Id, scope.data.dosificaciones[i].IdSucursal));
								_hayCambios = true;
							}
							if (scope.data.dosificaciones[i].Detalles[j].newDevolucion) {
								_llamadas.push(DosificacionDataService
									.devolucionToma(scope.data.dosificaciones[i].Detalles[j].Id, scope.data.dosificaciones[i].IdSucursal));
								_hayCambios = true;
							}
						}
						for (var j = 0; j < scope.data.dosificaciones[i].Descartables.length; j++) {
							if (scope.data.dosificaciones[i].Descartables[j].newFacturacion) {
								_llamadas.push(DosificacionDataService
									.facturarDosificacion(scope.data.dosificaciones[i].Descartables[j].Id, scope.data.dosificaciones[i].IdSucursal));
								_hayCambios = true;
							}
							if (scope.data.dosificaciones[i].Descartables[j].newDevolucion) {
								_llamadas.push(DosificacionDataService
									.devolucionDosificacion(scope.data.dosificaciones[i].Descartables[j].Id, scope.data.dosificaciones[i].IdSucursal));
								_hayCambios = true;
							}
						}
					}
					for (var i = 0; i < scope.data.infusiones.length; i++) {
						for (var j = 0; j < scope.data.infusiones[i].Detalles.length; j++) {
							if (scope.data.infusiones[i].Detalles[j].newFacturacion) {
								_llamadas.push(AgregadoDataService
									.facturarAgregado(scope.data.infusiones[i].Detalles[j].Id, scope.data.infusiones[i].IdSucursal));
								_hayCambios = true;
							}
							if (scope.data.infusiones[i].Detalles[j].newDevolucion) {
								_llamadas.push(AgregadoDataService
									.devolucionAgregado(scope.data.infusiones[i].Detalles[j].Id, scope.data.infusiones[i].IdSucursal));
								_hayCambios = true;
							}
						}
					}

					scope.formControl.loading = true;
					$q.all(_llamadas)
						.then(function () {
							scope.formControl.loading = false;
							if (_hayCambios) {
								$log.debug('Facturaciones - Devoluciones OK');
								AlertaService.NewSuccess("Cambios realizados correctamente");
							}
							internacionChanged();
						}, function () {
							scope.formControl.loading = false;
						});
				}

				function verCambios() {
					var _hayCambios = false;
					for (var i = 0; i < scope.data.dosificaciones.length; i++) {
						for (var j = 0; j < scope.data.dosificaciones[i].Detalles.length; j++) {
							if (scope.data.dosificaciones[i].Detalles[j].newFacturacion ||
								scope.data.dosificaciones[i].Detalles[j].newDevolucion)
								_hayCambios = true;
						}
						for (var j = 0; j < scope.data.dosificaciones[i].Descartables.length; j++) {
							if (scope.data.dosificaciones[i].Descartables[j].newFacturacion ||
								scope.data.dosificaciones[i].Descartables[j].newDevolucion)
								_hayCambios = true;
						}
					}
					for (var i = 0; i < scope.data.infusiones.length; i++) {
						for (var j = 0; j < scope.data.infusiones[i].Detalles.length; j++) {
							if (scope.data.infusiones[i].Detalles[j].newFacturacion ||
								scope.data.infusiones[i].Detalles[j].newDevolucion)
								_hayCambios = true;
						}
					}

					scope.formControl.hayCambios = _hayCambios;
				}

				function print() {
					StockFarmaciaModalService.printDosificacion();
				}

				function limpiar() {
					scope.formControl.ubicacionCargada = false;
					scope.formControl.limpiar = true;
					scope.formControl.internacionCargada = false;
					scope.data.dosificaciones = [];
					scope.data.infusiones = [];
					scope.formControl.hayCambios = false;
					scope.formData.internacion = '';
					// scope.formControl.enfermeria = StockFarmaciaLogicService.enfermeria;
					getPage();
				}

				scope.$watch(function () {
					return scope.activate;
				}, function (newValue) {
					if (newValue) {
						if (newValue) 
							getInternacionesPendientes();
						// scope.activate = false;
					}
				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				activate();

				function activate() {
					$log.debug('saStockTabFacturacion ON');
					scope.data.farmacia = StockFarmaciaLogicService.farmacia;
					scope.data.usuario = StockFarmaciaLogicService.usuario;
					scope.data.materiales = StockFarmaciaLogicService.materiales;
					var _estadosDosificacion = StockCommonDataService.getEstadosDosificacion();
					var _estadosInfusion = AgregadoDataService.getEstadoInfusion();
					var _estadosDosificacionHabilitados = StockCommonDataService.getEstadosDosificacionHabilitados();
					// scope.formControl.enfermeria = StockFarmaciaLogicService.enfermeria;

					scope.data.user = StockFarmaciaLogicService.usuario;
					for (let i = 0; i < scope.data.user.permisos.length; i++) {
						if(scope.data.user.permisos[i].Id == 227)
							scope.formControl.enfermeria = true;
					}
					// var _internaciones = UbicacionDataService.getAllInternacionesBySucursal()

					$q.all([_estadosDosificacion, _estadosInfusion, _estadosDosificacionHabilitados])
						.then(function (result) {
							scope.data.estadosDosificacion = result[0];
							scope.data.estadosInfusion = result[1];
							scope.data.estadosDosificacionHabilitados = result[2];
							StockFarmaciaLogicService.estadosDosificacion = scope.data.estadosDosificacionHabilitados;
							// getInternacionesPendientes();
							$log.debug('saStockTabFacturacion OK', scope.data.estadosDosificacion);
						});
				}
			}
		}
	};

	return module;
})();