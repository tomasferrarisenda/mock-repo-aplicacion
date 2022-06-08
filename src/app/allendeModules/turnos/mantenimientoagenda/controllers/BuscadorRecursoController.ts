/**
 * @author 			
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
   'use strict';
   
   
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('BuscadorRecursoController', BuscadorRecursoController);

		// Inyección de Dependencia
		BuscadorRecursoController.$inject = ['Logger', '$q', '$filter', '$scope', 'AlertaService',
			'$uibModalInstance', 'MantenimientoAgendaDataService', 'RecursosDataService',
			'IdServicio', 'IdSucursal'
		];

		// Constructor del Controller
		function BuscadorRecursoController($log, $q, $filter, $scope, AlertaService,
			$uibModalInstance, MantenimientoAgendaDataService, RecursosDataService,
			IdServicio, IdSucursal
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('BuscadorRecursoController');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				page: 'Buscador'
			};

			vm.formData = {
				recursoSeleccionado: null
			};

			vm.data = {
				recursos: [],
				tipos: []
			};

			vm.filter = {
				recursos: [],
				tipoRecurso: '',
				nombre: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 10,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.formControl = {
				loading: false,
				noResult: true,
				ok: returnRecurso,
				cancel: cancel,
				reloadPage: activate,
				validarForm: validarForm,
				clickFila: clickFila
			};

			vm.sort = function(keyname) {
				$scope.sortKey = keyname; //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function clickFila(recurso) {
					$uibModalInstance.close(recurso);

			}

			function cleanFilters() {
				vm.filter.tipoRecurso = '';
				vm.filter.nombre = '';
				vm.filter.recursos = '';
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageChanged();
			}

			function validarFilters() {

			}

			function getPage() {

				vm.filter.validar();

				var idTipoRec = 0;
				if (vm.filter.tipoRecurso !== null && !angular.isUndefined(vm.filter.tipoRecurso) && 
					vm.filter.tipoRecurso !== '') {
					idTipoRec = vm.filter.tipoRecurso.Id;
				}

				if (idTipoRec > 0) {
					vm.filter.recursos = $filter('filter')
						(vm.data.recursos, {
							IdTipo: idTipoRec,
							Nombre: vm.filter.nombre
						});
				} else {
					vm.filter.recursos = $filter('filter')
						(vm.data.recursos, {
							Nombre: vm.filter.nombre
						});
				}

				var cantidadRegistros = vm.filter.recursos.length;
				var cantidadPaginas: any = cantidadRegistros / vm.paginacion.pageSize;

				if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;

				//vm.filter.recursos = vm.data.recursos;					
				vm.paginacion.totalItems = vm.filter.recursos.length;
				vm.filter.recursos = vm.filter.recursos.slice(begin, end);
			}

			/* FORMULARIO */

			function validarForm() {
				var _flag = false;

				if (vm.formData.recursoSeleccionado && !angular.isUndefined(vm.formData.recursoSeleccionado.Id))
					_flag = true;

				return _flag;
			}

			function cancel() {
				//vm.formData.recursoSeleccionado = null;
				$uibModalInstance.dismiss('close');
			}

			function returnRecurso() {
				$log.debug('RecursoSeleccionado', vm.formData.recursoSeleccionado);
				$uibModalInstance.close(vm.formData.recursoSeleccionado);
			}

			function inicializarVariables() {
				vm.data.recursos = [];
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			// function cargarEntidades(results) {
			// 	vm.filter.recursos = vm.data.recursos;
			// 	getPage();
			// }

			// function cargarEntidadesError(pError) {
			// 	AlertaService.NewError("Error",pError.message);
			// }

			activate();

			function activate() {
				inicializarVariables();
				vm.formControl.loading = true;

				$log.debug('sucursal OK.-', IdSucursal);
				$log.debug('servicio OK.-', IdServicio);

				var _recursos;
				if (IdServicio === false && IdSucursal === false) {

					$log.debug('obtenerRecursos()');
					_recursos = MantenimientoAgendaDataService.obtenerRecursos();

				} else if (IdServicio && IdSucursal) {

					$log.debug('obtenerPorServicioEnSucursal()');
					var _recurso : any = {};
					_recurso.IdSucursal = angular.copy(IdSucursal);
					_recurso.IdServicio = angular.copy(IdServicio);
					_recursos = RecursosDataService.obtenerPorServicioEnSucursal(_recurso);

				} else if (IdServicio) {
					
					$log.debug('obtenerRecursoXServicioId()');
					_recursos = RecursosDataService.obtenerPorServicio(IdServicio);
				}


				var _tipos = MantenimientoAgendaDataService.obtenerTiposRecursos();

				$q.all([_recursos, _tipos])
					.then(activateOk, activateError);
			}

			function activateOk(pResults) {

				$log.debug('activateOk OK.-', pResults);

				vm.data.recursos = pResults[0];
				vm.data.tipos = pResults[1];

				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				vm.paginacion.getPage();

				cleanFilters();
			}

			function activateError(pError) {
				vm.formControl.loading = false;
				AlertaService.NewError("Error",pError.message);
			}
		}
	};

	return module;
})();