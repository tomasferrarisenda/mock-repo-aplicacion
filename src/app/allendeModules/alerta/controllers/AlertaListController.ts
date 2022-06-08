/**
 * @author 			mastore
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('AlertaListController', AlertaListController);

		// Inyeccion de dependencia
		AlertaListController.$inject = [
			'Logger', '$q', '$filter', '$state', 'moment',
			'AlertaDataService', 'AlertaLogicService',
			'ModalService',
			'User'
		];

		// Constructor del Controller
		function AlertaListController(
			$log, $q, $filter, $state, moment,
			AlertaDataService, AlertaLogicService,
			ModalService,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AlertaListController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			// En this va lo que se modifica de la vista (VM: ViewModel)
			var vm = this;

			vm.title = {
				page: $state.current.data.title
			};

			vm.data = {
				alertas: []
			};

			vm.filter = {
				destino: '',
				idDestino: '',
				tipoOrigen: '',
				tipoAlerta: '',
				tipoCriticidad: '',
				tipoVisualizacion: '',
				alertas: [],
				activa: true
			};

			vm.formControl = {
				selectTipoDestino: selectTipoDestino,
				selectTipoOrigen: selectTipoOrigen,
				buscar: buscar,
				verDestinatarios: verDestinatarios,
				reloadPage: cleanFilters,
				editar: editar,
				guardarEditar: guardarEditar,
				cancelarEditar: cancelarEditar,
				crearAlerta: crearAlerta,
				puedeCrear: false
			};

			vm.tipoDestino = {
				paciente: false,
				rol: false,
				usuario: false
			};


			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* PAGINACIÓN */

			function cleanFilters() {
				vm.filter.destino = '';
				vm.filter.tipoOrigen = '';
				vm.filter.tipoAlerta = '';
				vm.filter.tipoCriticidad = '';
				vm.filter.tipoVisualizacion = '';
				vm.filter.fechas = false;
				vm.filter.activa = true;
				vm.filter.fechaDesde = '';
				vm.filter.fechaHasta = '';
				vm.tipoDestino = {
					paciente: false,
					rol: false,
					usuario: false
				};
			}

			function validarFilters() {
				if (vm.filter.destino == null)
					vm.filter.destino = '';

				if (vm.filter.tipoOrigen == null) {
					vm.filter.tipoOrigen = '';
				}
				if (vm.filter.tipoAlerta == null) {
					vm.filter.tipoAlerta = '';
				}
				if (vm.filter.tipoCriticidad == null) {
					vm.filter.tipoCriticidad = '';
				}
				if (vm.filter.tipoVisualizacion == null) {
					vm.filter.tipoVisualizacion = '';
				}
			}

			function getPage() {
				$log.debug('Get Page ON');
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				validarFilters();
				vm.filter.alertas = $filter('filter')
					(vm.data.alertas, {
						TipoEntidad: vm.filter.destino.Nombre,
						TipoOrigen: vm.filter.tipoOrigen.Nombre,
						TipoAlerta: vm.filter.tipoAlerta.Nombre,
						TipoCriticidad: vm.filter.tipoCriticidad.Nombre,
						TipoVisualizacion: vm.filter.tipoVisualizacion.Nombre
					});
				$log.debug('filtro ', vm.filter.alertas);
				vm.paginacion.totalItems = vm.filter.alertas.length;
				vm.filter.alertas = vm.filter.alertas.slice(begin, end);
			}

			function selectTipoDestino() {
				vm.tipoDestino.paciente = false;
				vm.tipoDestino.rol = false;
				vm.tipoDestino.usuario = false;
				vm.filter.idDestino = 0;
				if (vm.filter.destino !== '') {
					if (vm.filter.destino.EsTipo)
						switch (vm.filter.destino.Id) {
							case 1:
								vm.tipoDestino.paciente = true;
								break;
						}
					else
						switch (vm.filter.destino.Id) {
							case 2:
								vm.tipoDestino.rol = true;
								break;
							case 1:
								vm.tipoDestino.usuario = true;
								break;
						}
				}

			}

			function selectTipoOrigen() {
				if (vm.filter.tipoOrigen)
					vm.data.tiposAlerta = vm.filter.tipoOrigen.TiposAlerta;
				else
					vm.data.tiposAlerta = '';
				getPage();
			}

			function buscar() {
				var alerta = angular.copy(vm.data.alertaDto);

				if (vm.filter.destino && vm.filter.destino !== '' && vm.filter.idDestino && vm.filter.idDestino !== '') {
					alerta.EsTipo = vm.filter.destino.EsTipo;
					alerta.IdTipoEntidad = vm.filter.destino.Id;
					alerta.IdEntidad = vm.filter.idDestino;
				}

				alerta.Activa = vm.filter.activa;

				if (vm.filter.fechas) {
					alerta.Fechas = vm.filter.fechas;
					if (vm.filter.fechaDesde && vm.filter.fechaDesde !== '')
						alerta.FechaDesde = moment(vm.filter.fechaDesde).format("MM-DD-YYYY");
					if (vm.filter.fechaHasta && vm.filter.fechaHasta !== '')
						alerta.FechaHasta = moment(vm.filter.fechaHasta).format("MM-DD-YYYY");
				}

				if (vm.filter.tipoCriticidad && vm.filter.tipoCriticidad !== '')
					alerta.IdTipoDeCriticidad = vm.filter.tipoCriticidad.Id;

				if (vm.filter.tipoVisualizacion && vm.filter.tipoVisualizacion !== '')
					alerta.IdTipoVisualizacionAlerta = vm.filter.tipoVisualizacion.Id;

				if (vm.filter.tipoOrigen && vm.filter.tipoOrigen !== '') {
					alerta.IdTipoOrigen = vm.filter.tipoOrigen.Id;
					if (vm.filter.tipoAlerta && vm.filter.tipoAlerta !== '')
						alerta.IdTipoAlerta = vm.filter.tipoAlerta.Id;
				}

				AlertaDataService.GetAlertasByFilters(alerta)
					.then(function (_alertas) {
						vm.data.alertas = _alertas;
						for (var i = vm.data.alertas.length - 1; i >= 0; i--) {

							if (vm.data.alertas[i].FechaHasta == "0001-01-01T00:00:00")
								vm.data.alertas[i].FechaHasta = "Ninguna";
						}
						getPage();
					});
			}

			function verDestinatarios(pAlerta) {
				$log.debug('verDestinatarios', pAlerta);
				AlertaLogicService.VerDestinatarios(pAlerta);
			}

			function editar(pAlerta) {
				for (var i = vm.data.alertas.length - 1; i >= 0; i--) {
					vm.data.alertas[i].editar = false;
					if (vm.data.alertas[i].FechaHastaAnt)
						vm.data.alertas[i].FechaHasta = vm.data.alertas[i].FechaHastaAnt;
					if (vm.data.alertas[i].FechaHasta == "0001-01-01T00:00:00")
						vm.data.alertas[i].FechaHasta = "Ninguna";
					if (vm.data.alertas[i].Id == pAlerta.Id) {
						vm.data.alertas[i].FechaHastaAnt = angular.copy(vm.data.alertas[i].FechaHasta);
						vm.data.alertas[i].FechaHasta = '';
						vm.data.alertas[i].editar = true;
					}
				}
				getPage();
			}

			function guardarEditar(pAlerta) {
				for (var i = vm.data.alertas.length - 1; i >= 0; i--) {
					if (vm.data.alertas[i].Id == pAlerta.Id) {
						vm.data.alertas[i].editar = false;
						if (vm.data.alertas[i].FechaHasta !== '') {
							var alerta = angular.copy(vm.data.alertaDto);
							$log.debug('guardar', vm.data.alertas[i]);
							// vm.data.alertas[i].FechaHasta = moment(vm.data.alertas[i].FechaHasta).format("MM-DD-YYYY hh:mm");
							alerta.Id = vm.data.alertas[i].Id;
							alerta.FechaHasta = moment(vm.data.alertas[i].FechaHasta).format("MM-DD-YYYY hh:mm");

							AlertaDataService.UpdateFecha(alerta);
						}
						else {
							vm.data.alertas[i].FechaHasta = vm.data.alertas[i].FechaHastaAnt;
						}
					}
				}
				getPage();
			}

			function cancelarEditar(pAlerta) {
				for (var i = vm.data.alertas.length - 1; i >= 0; i--) {
					if (vm.data.alertas[i].Id == pAlerta.Id) {
						vm.data.alertas[i].editar = false;
						vm.data.alertas[i].FechaHasta = vm.data.alertas[i].FechaHastaAnt;
					}
				}
				getPage();
			}

			function crearAlerta() {
				AlertaLogicService.NewAlerta();
			}

			function checkPermisos() {
				for (var i = 0; i < User.permisos.length; i++) {
					if (User.permisos[i].Id == 216)
						vm.formControl.puedeCrear = true;
				}
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate() {
				vm.formControl.loading = true;
				$log.debug('Inicializar ON.-');

				var tiposDestino = AlertaDataService.GetTiposDestino();
				var tiposOrigen = AlertaDataService.GetTiposOrigen();
				var tiposCriticidad = AlertaDataService.GetTiposCriticidad();
				var tiposVisualizacion = AlertaDataService.GetTiposVisualizacion();
				var alertaDto = AlertaDataService.GetDtoFilters();
				$q.all([tiposDestino, tiposOrigen, tiposCriticidad, tiposVisualizacion, alertaDto])
					.then(activateOk, activateError);
			}

			function activateOk(results) {

				checkPermisos();
				vm.data.tiposDestino = results[0];
				vm.data.tiposOrigen = results[1];
				vm.data.tiposCriticidad = results[2];
				vm.data.tiposVisualizacion = results[3];
				vm.data.alertaDto = results[4];

				vm.data.sucursales = User.sucursales;
				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				cleanFilters();
				vm.paginacion.getPage();
				$log.debug('Inicializar OK', results);
			}

			function activateError(pError) {
				vm.formControl.loading = false;
				$log.error('Inicializar ERROR.-', pError);
				ModalService.error(pError.message);
			}
		}

	};

	return module;
})();