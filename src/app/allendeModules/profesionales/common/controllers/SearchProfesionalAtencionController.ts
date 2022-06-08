import { IProfesionalesDataService, ProfesionalesDataService } from '../../profesionales';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchProfesionalAtencionController', SearchProfesionalAtencionController);

		// Inyección de Dependencia
		SearchProfesionalAtencionController.$inject = ['$log', '$q', '$scope', '$filter','$uibModalInstance',
			'ContratableDataService', 'idServicio', 'ProfesionalesDataService'];

		// Constructor del Controller
		function SearchProfesionalAtencionController ($log, $q, $scope, $filter, $uibModalInstance,
			ContratableDataService, idServicio, ProfesionalesDataService) {

				$log.debug('SearchProfesionalAtencionController: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;

				vm.formData = {
					profesionalSeleccionado : null
				};

				vm.formControl = {
					error : true,
					loading : false,
					cancel : cancel,
					profesionalElegido : false,
					profesionalSeleccion : profesionalSeleccion
				};

				vm.data = {
					profesionales : [],
					profesionalSeleccionado : ''
				};

				vm.filter = {
					profesionales : [],
					matricula : '',
					nombre : '',
				    validar : validarFilters
				};

				vm.paginacion = {
					currentPage: 0,
					pageSize: 10,
					totalItems: 0,
					pageChanged : getPage,
					getPage: getPage
				};
				/* ---------------------------------------- Paginacion --------------------------------------------- */
				vm.sort = function(keyname){
			        $scope.sortKey = keyname;
			        $scope.reverse = !$scope.reverse;
			    };

				function getPage () { 	
				 	var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;
					vm.filter.validar();
					vm.filter.profesionales = $filter('filter')
						(vm.data.profesionales, {
							Matricula: vm.filter.matricula,
							Nombre: vm.filter.nombre
						});
					vm.paginacion.totalItems = vm.filter.profesionales.length;
					vm.filter.profesionales = vm.filter.profesionales.slice(begin, end);
				}

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function profesionalSeleccion (profesional) {

					ProfesionalesDataService.ProfesionalAtencionObtenerNuevo().then(function (profesionalAtencionDto){
						profesionalAtencionDto.IdProfesional = profesional.Id;
						profesionalAtencionDto.Matricula = profesional.Matricula;
						profesionalAtencionDto.Profesional = profesional.Nombre;
						profesionalAtencionDto.Nombre = profesional.Nombre;
						$uibModalInstance.close(profesionalAtencionDto);
					})
 					
 				}

				function validarFilters () {
 					if (vm.filter.matricula == null)
						vm.filter.matricula = '';
					if (vm.filter.nombre == null)
						vm.filter.nombre = '';
				}

				 /* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();

				function activate () {
					vm.formControl.loading = true;
					ContratableDataService.ObtenerProfesionalesPorServicio(idServicio).then(function (profesionales) {
						vm.data.profesionales = profesionales;
						vm.filter.profesionales = vm.data.profesionales;
						vm.paginacion.currentPage = 1;
						vm.paginacion.pageSize = 10;
						vm.paginacion.getPage();
						vm.formControl.loading = false;
					});
				}
			}
	};
	return module;

})();