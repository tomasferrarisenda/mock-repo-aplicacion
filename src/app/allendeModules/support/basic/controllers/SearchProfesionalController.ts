import { ISucursalDataService, ISupportDataService } from '../services';
import { IProfesionalesDataService } from '../../../profesionales';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchProfesionalController', SearchProfesionalController);

		// Inyección de Dependencia
		SearchProfesionalController.$inject = ['$log', '$scope', '$filter','$uibModalInstance', 'User', 'FACTURACION_INFO',
			'SupportDataService', 'SucursalDataService', 'ProfesionalesDataService'
		];

		// Constructor del Controller
		function SearchProfesionalController ($log, $scope, $filter, $uibModalInstance, User, FACTURACION_INFO,
			SupportDataService: ISupportDataService, SucursalDataService: ISucursalDataService, ProfesionalesDataService: IProfesionalesDataService) {

				$log.debug('SearchProfesionalController: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;
				vm.user = User;
				vm.title = {
					module: FACTURACION_INFO.title,
					page: 'Search Profesional'
				};

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
					servicios : [],
					matricula : '',
					nombre : '',
					servicioElegido : '',
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
					(vm.data.profesionales,{
						Nombre : vm.filter.nombre,
						Matricula : vm.filter.matricula,
					});
					vm.filter.profesionales = $filter('filter')(vm.filter.profesionales,filtrarServicioProfesional);
					vm.filter.profesionales = $filter('filter')(vm.filter.profesionales,filtrarSucursalProfesional);
					vm.paginacion.totalItems = vm.filter.profesionales.length;
					vm.filter.profesionales = vm.filter.profesionales.slice(begin, end);
				}

				function filtrarServicioProfesional(value){
					if(vm.filter.servicioElegido.Id != null)
						for (var i = value.Servicios.length - 1; i >= 0; i--) {
							if(value.Servicios[i] == vm.filter.servicioElegido.Id)
								return true;
						}
					else{
						return true;
					}
					return false; // TODO: ver si esta bien
				}

				function filtrarSucursalProfesional(value){
					if(vm.filter.sucursalElegida.Id != null)
						for (var i = value.Sucursales.length - 1; i >= 0; i--) {
							if(value.Sucursales[i] == vm.filter.sucursalElegida.Id)
								return true;
						}
					else{
						return true;
					}
					return false; // TODO: ver si esta bien
				}

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function profesionalSeleccion (profesional) {
 					$uibModalInstance.close(profesional);
 				}

				function validarFilters () {
 					if (vm.filter.matricula == null)
						vm.filter.matricula = '';
					if (vm.filter.nombre == null)
						vm.filter.nombre = '';
					if (vm.filter.servicioElegido == null)
						vm.filter.servicioElegido = '';
					if (vm.filter.sucursalElegida == null)
						vm.filter.sucursalElegida = '';
				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();

				function activate () {
					vm.formControl.loading = true;

					SupportDataService.getAllServicioMedico()
						.then(function (pServicios) {
							vm.filter.servicios = pServicios;
						}, function (pError) {
							$log.error('Error en carga de combo servicios', pError);
						});

					SucursalDataService.getAllSucursalesCombo()
						.then(function (pSucursales) {
							vm.filter.sucursales = pSucursales;
						}, function (pError) {
							$log.error('Error en carga de combo sucursales', pError);
						});

					ProfesionalesDataService.getProfesionalesInternos()
					.then(activateOk, activateError);
				}

				function activateOk (pResults) {
					vm.data.profesionales = pResults;
					vm.filter.profesionales = vm.data.profesionales;

					vm.formControl.error = false;
					vm.formControl.loading = false;
					vm.paginacion.currentPage = 1;
 					vm.paginacion.pageSize = 10;
					vm.paginacion.getPage();
				}

				function activateError (pError) {
					vm.formControl.loading = false;
					$uibModalInstance.dismiss(pError);
				}
			}
	};
	return module;

})();