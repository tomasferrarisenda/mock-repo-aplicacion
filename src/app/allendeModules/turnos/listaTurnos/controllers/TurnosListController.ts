/**
 * @author:			Pablo Pautasso
 * @description:	controller para lista de turnos por recurso o distintas busquedas	
 * @type:			Controller
 **/

import * as angular from 'angular';
import { ISucursalDataService } from '../../../support/basic/services';
import { IDisponibilidadDeTurnosDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('TurnosListController', TurnosListController);


		TurnosListController.$inject = [
			'Logger', '$q', '$filter', 'moment',
			'SucursalDataService', 'AsignacionTurnoDataService', 'TurnoDataService', 'AlertaService', 'DateUtils',
			'TurnosCommonLogicService', 'DisponibilidadDeTurnosDataService', 'CredentialsDataService', 'MantenimientoAgendaAuthService'
		];

		function TurnosListController(
			$log, $q, $filter, moment,
			SucursalDataService: ISucursalDataService, AsignacionTurnoDataService, TurnoDataService, AlertaService, DateUtils,
			TurnosCommonLogicService, DisponibilidadDeTurnosDataService: IDisponibilidadDeTurnosDataService,
			CredentialsDataService, MantenimientoAgendaAuthService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('TurnosListController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.today = new Date();
			vm.fechadesdeMin = new Date();

			

			vm.title = {
				icon: 'LIST',
				page: 'Lista de turnos'

			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage,
				configPagination: configPagination
			};

			vm.data = {
				soloAgendaActiva: true
			};

			vm.formData = {};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				buscar: buscar,
				handleEventProp: handleEventProp,
				clean: cleanFilters,
				changeServicioMedico: changeServicioMedico,
				changeRecurso: changeRecurso,
				changeFechaDesde: changeFechaDesde,
				permisoVerMotivoDeReceso: false
			};

			vm.table = {
				verMotivoCancelacionTurno: verMotivoCancelacionTurno,
				verObservacionTurno: verObservacionTurno
			}

			vm.filter = {
				id: '',
				validar: validarFilters,
				turnos: []
			};

			vm.diasSemana = [
				{
					IdDia: 1,
					Nombre: "LUNES",
					Selected: false
				}, {
					IdDia: 2,
					Nombre: "MARTES",
					Selected: false
				}, {

					IdDia: 3,
					Nombre: "MIERCOLES",
					Selected: false
				}, {

					IdDia: 4,
					Nombre: "JUEVES",
					Selected: false
				}, {

					IdDia: 5,
					Nombre: "VIERNES",
					Selected: false
				}, {

					IdDia: 6,
					Nombre: "SABADO",
					Selected: false
				}, {

					IdDia: 7,
					Nombre: "DOMINGO",
					Selected: false
				}
			]

			vm.columnasTabla = [
				{
					label: "Fecha",
					field: "Fecha",
					order: 1,
					format: 'date',

				},
				{
					label: "Hora",
					field: "Hora",
					order: 2,
					classCell: 'ColorDuracionMultiple'
				},
				{
					label: "ST",
					field: "ST",
					order: 3
				},
				{
					label: "Estado",
					field: "NombreEstado",
					order: 4,
					classCell: 'ColorEstado'
				},
				{
					label: "Dur.",
					field: "Duracion",
					order: 5
				},
				{
					label: "Sucursal",
					field: "NombreSucursal",
					order: 6,
					classCell: 'ColorSucursal'
				},
				{
					label: "Paciente",
					field: "Paciente",
					order: 7
				},
				{
					label: "Documento",
					field: "Documento",
					order: 8
				},
				{
					label: "Financiador",
					field: "MutualYPlan",
					order: 9
				},
				{
					label: "Tipo Turno",
					field: "TipoTurno",
					order: 10
				},
				{
					label: "Prestacion",
					field: "Prestaciones",
					order: 11
				},
				{
					label: "Fecha Asignacion",
					field: "FechaAlta",
					order: 12,
					format: 'date',
				}];

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */


			function changeServicioMedico() {
				$log.debug('change Servicio Medico...');
				vm.data.recurso = null;
				delete vm.filter.turnos;
			}

			function changeRecurso() {
				$log.debug('change Recurso...');
				delete vm.filter.turnos;
			}

			function buscar() {

				$log.debug('*** Permiso para mostrar motivos 1: ', vm.formControl.permisoVerMotivoDeReceso);
											

				$log.debug('buscando turnos...', vm.data.servicioMedico, vm.data.recurso, vm.data.sucursal);

				if (vm.data.fechaDesde && vm.data.fechaHasta) {
					vm.formControl.loading = true;

					if (moment(vm.data.fechaDesde).isSameOrBefore(moment(vm.data.fechaHasta))) {

						var _fechaDesde = angular.copy(moment(vm.data.fechaDesde).format('MM-DD-YYYY'));
						var _fechaHasta = angular.copy(moment(vm.data.fechaHasta).format('MM-DD-YYYY'));

						let filtroObtenerTurnosPorRecurso = {
							FechaDesde: _fechaDesde,
							FechaHasta: _fechaHasta,
							IdRecurso: vm.data.recurso.Id,
							IdTipoRecurso: vm.data.recurso.IdTipoRecurso,
							IdServicio: vm.data.servicioMedico.Id,
							SoloAgendaActiva: vm.data.soloAgendaActiva,
							ListaDeDias:  Array<number> ()
						};

						filtroObtenerTurnosPorRecurso.FechaDesde = _fechaDesde;
						filtroObtenerTurnosPorRecurso.FechaHasta = _fechaHasta;
						filtroObtenerTurnosPorRecurso.IdRecurso = vm.data.recurso.Id;
						filtroObtenerTurnosPorRecurso.IdTipoRecurso = vm.data.recurso.IdTipoRecurso;
						filtroObtenerTurnosPorRecurso.IdServicio = vm.data.servicioMedico.Id;
						filtroObtenerTurnosPorRecurso.SoloAgendaActiva = vm.data.soloAgendaActiva;

						vm.diasSemana.forEach(dia => {
							if(dia.Selected)
								filtroObtenerTurnosPorRecurso.ListaDeDias.push(dia.IdDia);
						});

						DisponibilidadDeTurnosDataService.obtenerTurnosPorRecurso(filtroObtenerTurnosPorRecurso)
						// AsignacionTurnoDataService.obtenerTurnosPorRecurso(vm.data.servicioMedico.Id, vm.data.recurso.Id,
						// 	vm.data.recurso.IdTipoRecurso, _fechaDesde, _fechaHasta, vm.data.soloAgendaActiva)
							.then(function (pResults) {

								vm.data.turnos = pResults;
								connectData();
								vm.paginacion.configPagination();
								vm.formControl.loading = false;
								$log.debug('getTurnosPorRecurso', pResults);

							}, function (pError) {

								vm.formControl.loading = false;
								$log.error('getTurnosPorRecurso', pError);
							});
					} else {
						AlertaService.NewWarning('Alerta', 'Elija un rango de fecha valido para buscar');
						vm.formControl.loading = false;

					}
				} else AlertaService.NewWarning('Alerta', 'Elija un rango de fecha valido para buscar');
			}

			function handleEventProp() {
				$('.dropdown-menu').click(function (e) {
					e.stopPropagation();
				});
			}
			/* ----------------------------------------- ENTRELAZADO DE DATOS --------------------------------------- */

			function connectData() {

				angular.forEach(vm.data.turnos, function (turno) {

					//comentamos, ya que agregamos una columna para sobreturnos (ST)
					// if(turno.EsSobreTurno){
					// 	turno.TipoTurno = angular.copy(turno.TipoTurno + ' (Sobreturno)');
					// }

					if (turno.Duracion.length > 0)
						turno.ColorDuracionMultiple = 'color-turno-duracion-multiple';

					angular.forEach(vm.data.sucursales, function (sucursal) {

						if (turno.IdSucursal === sucursal.Id) {
							turno.NombreSucursal = angular.copy(sucursal.Nombre);
							turno.ColorSucursal = angular.copy(sucursal.Color);
						}

					});

					angular.forEach(vm.data.tiposEstadoTurno, function (estadoTurno) {

						if (turno.IdEstado === estadoTurno.Id) {
							turno.NombreEstado = angular.copy(estadoTurno.Nombre);
							turno.ColorEstado = angular.copy(estadoTurno.Color);
							turno['es' + estadoTurno.Nombre] = true;
						}

					});

					if (!turno.Paciente) turno.Paciente = '-';

					if (turno.TipoDocumento) turno.Documento = turno.TipoDocumento + " " + turno.Documento;
				});
			}

			/* --------------------------------------------- PAGINACION --------------------------------------------- */

			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.nombre = '';
				delete vm.data.servicioMedico;
				delete vm.data.recurso;
				delete vm.filter.turnos;
				delete vm.data.turnos;
				vm.order = {};
				//vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.id == null)
					vm.filter.id = '';

				if (vm.filter.nombre == null)
					vm.filter.nombre = '';


				vm.order = {
					id: 5,
					value: 'Id',
					descripcion: 'Id (Asc)',
					reverse: false
				};

			}

			function esMostrado(value) {

				var flag = false;
				var flagReturn = false;

				// Reviso si hay algun elemento activo
				for (var i = vm.data.tiposEstadoTurno.length - 1; i >= 0; i--) {
					if (vm.data.tiposEstadoTurno[i].status) {
						flag = true;
						break;
					}
				}

				if (flag) {

					for (var j = vm.data.tiposEstadoTurno.length - 1; j >= 0; j--) {
						var estado = vm.data.tiposEstadoTurno[j];
						if (estado.status && value.IdEstado === estado.Id) {

							flagReturn = true;

						}
					}

				} else {
					flagReturn = true;
				}

				return flagReturn;
			}


			function getPage() {


				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;

				vm.filter.turnos = $filter('filter')(vm.data.turnos, esMostrado);


				vm.paginacion.totalItems = vm.filter.turnos.length;
				vm.filter.turnos = vm.filter.turnos.slice(begin, end);
			}

			function configPagination() {

				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				vm.paginacion.getPage();

			}


			/* ---------------------------------------------- MENU CONTEXTUAL ---------------------------------------------- */

			function verMotivoCancelacionTurno(rowTurno) {
				$log.debug('verMotivoCancelacionTurno', rowTurno);
				var turno = angular.copy(rowTurno.row);
				if (turno.esCancelado) {
					TurnosCommonLogicService.openMotivosCancelacionDeUnTurno(turno.Id);
				} else {
					AlertaService.NewWarning("El turno no está cancelado");
				}
			}

			function verObservacionTurno(rowTurno) {
				$log.debug('verObservacionTurno', rowTurno);
				var turno = angular.copy(rowTurno.row);
				if (turno.IdEstado !== 8 && turno.Id !== 0) {
					TurnoDataService.obtenerObservacionesPorTurno(turno.Id)
						.then((pObservacionOk) => {

							if (pObservacionOk.length > 0) {
								TurnosCommonLogicService.openObservacionTurno(TurnosCommonLogicService.parsearObservaciones(pObservacionOk));
							}
							else AlertaService.NewWarning("No existe ninguna observación");
						}, (pObservacionError) => {

							$log.error('Obtener ObservacionError', pObservacionError);
						});

				} else {
					AlertaService.NewWarning("El turno no tiene observación");
				}

			}

			function changeFechaDesde() {
				vm.fechadesdeMin.setDate(vm.data.fechaDesde.getDate() - 1);
			}


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {

				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				vm.data.fechaDesde = angular.copy(vm.today);

				//vm.data.fechaHasta = angular.copy(moment(vm.today, "DD-MM-YYYY").add(7,'days').format('DD/MM/YYYY'));
				vm.data.fechaHasta = angular.copy(DateUtils.addDays(vm.today, 7));

				var _sucursalesConColor = SucursalDataService.obtenerTodasSinExcepciones();
				var _tiposDeEstadoTurno = TurnoDataService.obtenerTiposEstadoTurnos();

				vm.infoUser = CredentialsDataService.GetForce();			
				$log.debug('infoUser: ', vm.infoUser);
				vm.formControl.permisoVerMotivoDeReceso = angular.copy(MantenimientoAgendaAuthService.puedeVerMotivoDeReceso(vm.infoUser));
								

				$q.all([
					_sucursalesConColor,
					_tiposDeEstadoTurno
				])
					.then(successCallback, errorCallback);

				function successCallback(pResults) {
					// variable = pResult[0];

					vm.data.sucursales = pResults[0];
					vm.data.tiposEstadoTurno = pResults[1];
					vm.formControl.loading = false;
					$log.debug('Inicializar OK.-', pResults);
					vm.fechadesdeMin.setDate(vm.data.fechaDesde.getDate() - 1);
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					$log.error('Inicializar ERROR.-', pError);
					AlertaService.NewError("Error", pError.message);
				}
			}

		}
	};

	return module;
})();