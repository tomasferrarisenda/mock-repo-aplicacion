/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('ServicioController', ServicioController);

		ServicioController.$inject = [
			'$scope', 'Logger', '$q', 'orderByFilter', '$filter', '$state',

			'ModalService',
			'ServiciosGestionLogicService',
			'PrestacionGestionDataService',
			'PrestacionGestionLogicService',
			'EspecialidadMedicaDataService',
			'EspecialidadMedicaLogicService',
			'RecursosDataService',
			'RecursosLogicService',
			
			'User'
		];

		function ServicioController(
			$scope, $log, $q, orderByFilter, $filter, $state,

			ModalService,
			ServiciosGestionLogicService,
			PrestacionGestionDataService,
			PrestacionGestionLogicService,
			EspecialidadMedicaDataService,
			EspecialidadMedicaLogicService,
			RecursosDataService,
			RecursosLogicService,

			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServicioController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.user = User;
			vm.tabs = [];
			vm.title = {
				
				small: 'Servicio: ' + ServiciosGestionLogicService.NombreServicio
			};


			
			vm.paginacionPrestacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.paginacionEspecialidades = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.paginacionRecursos = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.filter = {
				id: '',
				clean: cleanFilters,
				validar: validarFilters,
				nombrePrestacion : '',
				tipoRecurso : ''


			};


			vm.data = {
				prestaciones: [],
				especialidades: [],
				recursos: [],
				tipoRecursos: []

			};

			vm.prestacion = {
				desactivar: desactivarPrestacion,
				delete: deletePrestacion,
				new: asignarPrestacion
					// asignar : asignarPrestacion
			};

			vm.especialidad = {
				new: asignarEspecialidad,
				desactivar: desactivarEspecialidad,
				delete: deleteEspecialidad,
				view: viewEspecialidad
			};

			vm.recurso = {
				new: asignarRecurso,
				desactivar: desactivarRecurso,
				delete: deleteRecurso,
				view: viewRecurso,
				add: addRelacion
			};



			// formData: contiene los datos que provienen del formulario.
			vm.formData = {

			};

			// formControl son métodos que manejan el formulario y la página.
			vm.formControl = {
				error: true,
				loading: true,
				//externo : PreadmisionDataService.externo || false,
				volver: volver,
				reloadPage: activate,


				//				Tabs
				nextTab: nextTab,
				previousTab: previousTab
			};

			vm.validar = {

			};



			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			/* -------------------------------------IMPLEMENTACION PRESTACION---------------------------------------- */

			function asignarPrestacion() {

				$log.debug('asignarPrestacion OK.-');

				var idServicio = ServiciosGestionLogicService.IdServicio;
				var idSucursal = ServiciosGestionLogicService.IdSucursal;
				PrestacionGestionLogicService.asignarPrestacion(idSucursal, idServicio)
					.then(asignarPrestacionOk, asignarPrestacionError);

				function asignarPrestacionOk(pResult) {

					activate();
					$log.debug('asignarPrestacionOk OK.-', pResult);

				}

				function asignarPrestacionError(pError) {

					$log.debug('asignarPrestacionError .-', pError);

				}

			}


			function desactivarPrestacion(pPrestacion) {

				PrestacionGestionLogicService.activarDesactivarPrestacion(pPrestacion)
					.then(success, error);

				function success(pOk) {
					$log.debug('activarDesactivarPrestacion .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('activarDesactivarPrestacion .-', pError);

				}



			}

			function deletePrestacion(pPrestacion) {


				$log.debug('deletePrestacion: ');


				PrestacionGestionLogicService.deleteRelacionServicio(pPrestacion)
					.then(success, error);

				function success(pOk) {
					$log.debug('deletePrestacion .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('deletePrestacion .-', pError);

				}
			}



			/* -----------------------------------IMPLEMENTACION ESPECIALIDAD---------------------------------------- */


			function asignarEspecialidad() {

				$log.debug('asignarEspecialidad OKdd.-');

				var idServicio = ServiciosGestionLogicService.IdServicio;
				var idSucursal = ServiciosGestionLogicService.IdSucursal;
				EspecialidadMedicaLogicService.asignar(idSucursal, idServicio)
					.then(asignarOk, asignarError);

				function asignarOk(pResult) {

					activate();
					$log.debug('asignar Ok .-', pResult);

				}

				function asignarError(pError) {

					$log.debug('asignarError .-', pError);

				}

			}


			function desactivarEspecialidad(pEspecialidad) {


				EspecialidadMedicaLogicService.activarDesactivar(pEspecialidad)
					.then(success, error);

				function success(pOk) {
					$log.debug('activarDesactivarEspecialidad .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('activarDesactivarEspecialidad .-', pError);

				}


			}

			function deleteEspecialidad(pEspecialidad) {

				$log.debug('deleteEspecialidad: ');

				EspecialidadMedicaLogicService.deleteRelacionServicio(pEspecialidad)
					.then(success, error);

				function success(pOk) {
					$log.debug('deleteEspecialidad .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('deleteEspecialidad .-', pError);

				}


			}

			function viewEspecialidad(pEspecialidad) {
				$log.debug('viewEspecialidad: ', pEspecialidad);
			}



			/* --------------------------------------IMPLEMENTACION RECURSO------------------------------------------ */

			function asignarRecurso() {

				$log.debug('asignarRecurso OK.-');

				var idServicio = ServiciosGestionLogicService.IdServicio;
				var idSucursal = ServiciosGestionLogicService.IdSucursal;
				RecursosLogicService.asignar(idSucursal, idServicio)
					.then(asignarOk, asignarError);

				function asignarOk(pResult) {
					$log.debug('asignar Ok .-', pResult);
					activate();

				}

				function asignarError(pError) {

					$log.debug('asignarError .-', pError);

				}

			}


			function desactivarRecurso(pRecurso) {

				RecursosLogicService.activarDesactivar(pRecurso)
					.then(success, error);

				function success(pOk) {
					$log.debug('activarDesactivarRecurso .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('activarDesactivarRecurso .-', pError);

				}


			}

			function deleteRecurso(pRecurso) {

				$log.debug('deleteRecurso: ');

				RecursosLogicService.deleteRelacionServicio(pRecurso)
					.then(success, error);

				function success(pOk) {
					$log.debug('deleteRecursoOk .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('deleteRecursoError .-', pError);

				}
			}

			function viewRecurso(pRecurso) {

			
				RecursosLogicService.addRelaciones(pRecurso,ServiciosGestionLogicService.IdSucursal,ServiciosGestionLogicService.IdServicio,'ver')
				.then(success,error);

				function success(pOk) {
					$log.debug('addRelacionesOK .-', pOk);
				}

				function error(pError) {
					$log.debug('addRelacionesERROR .-', pError);

				}
				
			}

			function addRelacion(pRecurso) {

				RecursosLogicService.addRelaciones(pRecurso,ServiciosGestionLogicService.IdSucursal,ServiciosGestionLogicService.IdServicio,'asignar')
				.then(success,error);

				function success(pOk) {
					$log.debug('addRelacionesOK .-', pOk);
				}

				function error(pError) {
					$log.debug('addRelacionesERROR .-', pError);

				}
			}



			/* FORMULARIO */


			function inicializarVariables() {
				vm.tabs = [];

			}


			function volver() {
				$state.go('basico.serviciomedico.gestion.list');
				//$location.url(ACTION.LIST);
			}



			function llenarTabs() {

				vm.tabs = ServiciosGestionLogicService.getTabs(User);
				$log.debug('tabssssss', vm.tabs);

			}

			function nextTab(pId) {
				$log.debug('NEXT', pId);
				
				ServiciosGestionLogicService.nextTab(pId, vm.tabs);



			}

			function previousTab(pId) {
				$log.debug('PREV', pId);
				ServiciosGestionLogicService.previousTab(pId, vm.tabs);
			}



			/* watch */

			$scope.$watch(function() {
				return vm.formControl.protesisChanged;
			}, function(newVal, oldVal) {
				if (newVal)
					validarEstadoPreadmision();
			});

			function validarEstadoPreadmision() {
				// $log.debug('Algunar prótesis cambio');
				// PreadmisionDataService.calcularEstadoPreadmision($scope.data.solicitud.id_internacion);
				// vm.formControl.protesisChanged = false;
			}



			/* PAGINACIÓN */

			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.nombrePrestacion = '';
				vm.filter.tipoRecurso = '';
				vm.paginacionRecursos.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.id === null)
					vm.filter.id = '';

				if (vm.filter.nombrePrestacion === null)
					vm.filter.nombrePrestacion = '';

				if (vm.filter.tipoRecurso === null)
					vm.filter.tipoRecurso = '';
				
				vm.order = {
					id: 1,
					value: 'Numero',
					descripcion: 'Codigo (Asc)',
					reverse: false
				};

			}


			function getPage() {

				var begin = ((vm.paginacionRecursos.currentPage - 1) * vm.paginacionRecursos.pageSize);
				var end = begin + vm.paginacionRecursos.pageSize;
				vm.filter.validar();
				vm.data.recursos = orderByFilter(vm.data.recursos, vm.order.value, vm.order.reverse);

				vm.filter.recursos = $filter('filter')
					(vm.data.recursos, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombrePrestacion,
						TipoRecurso : vm.filter.tipoRecurso.Nombre

					});

				vm.paginacionRecursos.totalItems = vm.filter.recursos.length;
				vm.filter.recursos = vm.filter.recursos.slice(begin, end);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				$log.info('Inicializar ON.-');

				inicializarVariables();
				llenarTabs();

				vm.formControl.error = true;
				vm.formControl.loading = true;

				var idServicio = ServiciosGestionLogicService.IdServicio;
				var idSucursal = ServiciosGestionLogicService.IdSucursal;

				var _prestaciones = PrestacionGestionDataService.obtenerPorServicioEnSucursal(idSucursal, idServicio);

				var _especialidades = EspecialidadMedicaDataService.obtenerPorServicioEnSucursal(idSucursal, idServicio);
				var _recurso : any = {};
				_recurso.IdSucursal = angular.copy(idSucursal);
				_recurso.IdServicio = angular.copy(idServicio);
				var _recursos = RecursosDataService.obtenerPorServicioEnSucursal(_recurso);
				var _tipoRecursos = RecursosDataService.getAllTipos();
				//var _recursos = ServiciosGestionDataService.getByServicio();

				$q.all([_prestaciones, _especialidades, _recursos, _tipoRecursos])
					.then(activateOk, activateError);

			}


			function activateOk(pResults) {

				vm.data.prestaciones = pResults[0];
				vm.data.especialidades = pResults[1];
				vm.data.recursos = pResults[2];
				vm.data.tipoRecursos = pResults[3];


				vm.paginacionPrestacion.currentPage = 1;
				vm.paginacionPrestacion.pageSize = 10;
				vm.paginacionPrestacion.getPage();

				vm.paginacionEspecialidades.currentPage = 1;
				vm.paginacionEspecialidades.pageSize = 8;
				vm.paginacionEspecialidades.getPage();

				vm.paginacionRecursos.currentPage = 1;
				vm.paginacionRecursos.pageSize = 8;
				vm.paginacionRecursos.getPage();


				vm.formControl.loading = false;
				vm.formControl.stateLoading = false;

				vm.formControl.loading = false;
				vm.formControl.error = false;

				$log.debug('Activate ServicioController OK.-', pResults);

				$log.debug('Activate ServicioController OK.-', vm.data.tipoRecursos);

			}


			function activateError(pError) {
				vm.formControl.loading = false;
				$log.error('ServicioController: Inicializar ERROR.-', pError);
				ModalService.error(pError.message);
			}

		}
	};

	return module;

})();