/**
 * @author 			
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('BuscadorServicioMedicoController', BuscadorServicioMedicoController);

		// Inyección de Dependencia
		BuscadorServicioMedicoController.$inject = ['Logger', '$q', '$filter', '$scope', 'ModalService', 
			'$uibModalInstance', 'ServiciosGestionDataService'
		];

		// Constructor del Controller
		function BuscadorServicioMedicoController ($log, $q, $filter, $scope, ModalService, 
			$uibModalInstance, ServiciosGestionDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('BuscadorServicioMedicoController');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				page: 'Buscador'
			};

			vm.formData = {
				recursoSeleccionado : null
			};

			vm.data = {
				servicioMedico : [],
				tipos : []
			};

			vm.filter = {
				servicioMedico : [],
				tipoRecurso : '',
				nombre : '',
				clean : cleanFilters,
				validar : validarFilters
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 10,
				totalItems: 0,
				pageChanged : getPage,
				getPage: getPage
			};		

			vm.formControl = {
				loading : false,
				noResult: true,
				ok: returnRecurso,
				cancel : cancel,
				reloadPage : activate,
				validarForm : validarForm,
				clickFila: clickFila
			};

			vm.sort = function(keyname){
				$scope.sortKey = keyname;   //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function clickFila(data) {
				$uibModalInstance.close(data);
				
			}

			function cleanFilters () {
				vm.filter.tipoRecurso = '';
				vm.filter.nombre = '';
				vm.filter.servicioMedico = '';
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageChanged();
			}

			function validarFilters () {
				
			}

			function getPage () { 	

				vm.filter.validar();

				var idTipoRec = 0;
				if(vm.filter.tipoRecurso != null && !angular.isUndefined(vm.filter.tipoRecurso) && vm.filter.tipoRecurso != '') {
					idTipoRec = vm.filter.tipoRecurso.Id;
				}

				if (idTipoRec > 0 ) {
					vm.filter.servicioMedico = $filter('filter')
						(vm.data.servicioMedico, {
							IdTipo : idTipoRec,
							Nombre : vm.filter.nombre
						});	
				} else {
					vm.filter.servicioMedico = $filter('filter')
						(vm.data.servicioMedico, {
							Nombre : vm.filter.nombre
						});	
				} 

				var cantidadRegistros = vm.filter.servicioMedico.length;
				var cantidadPaginas : any = cantidadRegistros / vm.paginacion.pageSize;

				if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;	
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;					

				//vm.filter.servicioMedico = vm.data.servicioMedico;					
				vm.paginacion.totalItems = vm.filter.servicioMedico.length;					
				vm.filter.servicioMedico = vm.filter.servicioMedico.slice(begin, end);		                        
			}	

			/* FORMULARIO */

			function validarForm () {
				var _flag = false;

				if (vm.formData.recursoSeleccionado && !angular.isUndefined(vm.formData.recursoSeleccionado.Id))
					_flag=true;

				return _flag;
			}

			function cancel () {
				//vm.formData.recursoSeleccionado = null;
				$uibModalInstance.dismiss('close');
			}

			function returnRecurso () {
				$log.debug('ServicioSeleccionado', vm.formData.recursoSeleccionado);
				$uibModalInstance.close(vm.formData.recursoSeleccionado);
			}

			function inicializarVariables () {
				vm.data.servicioMedico = [];
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			function cargarEntidades(results) {
				vm.filter.servicioMedico = vm.data.servicioMedico;	
				getPage();	
			}

			function cargarEntidadesError (pError) {
				ModalService.error(pError.message);
			}

			activate();
			
			function activate () {
				inicializarVariables();
				vm.formControl.loading = true;

	
				var _servicioMedico = ServiciosGestionDataService.getAll()
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {

				$log.debug('activateOk OK.-',pResults);

				vm.data.servicioMedico = pResults;

				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				vm.paginacion.getPage();
				
				cleanFilters();	
			}

			function activateError (pError) {
				vm.formControl.loading = false;
				ModalService.error(pError.message);
			}
		}
	}

	return module;

})();