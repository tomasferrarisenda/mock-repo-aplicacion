/**
 * @author:			Pablo Pautasso
 * @description:	
 * @type:			Controller
 **/
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('EspecialidadesGestionListController', EspecialidadesGestionListController);

		EspecialidadesGestionListController.$inject = ['$location', 'Logger', '$q', '$filter', 'ModalService', 'EspecialidadMedicaDataService'];

		function EspecialidadesGestionListController ($location,  $log, $q, $filter, ModalService, EspecialidadMedicaDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EspecialidadesGestionListController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				page: 'Gestion de Especialidades'
			};

			vm.data = {
			}

			vm.formData = {
			}

			vm.formControl = {
				loading : false,
				error : true,
				reloadPage : activate
			}
			
			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.prestacion = {
			};

			vm.filter = {
				Nombre: '',
				Codigo: '',
				clean: cleanFilters,
			};
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			
			function llenarForm () {
			}

			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.nombrePrestacion = '';
				vm.paginacion.pageChanged();
			}

			function getPage() {

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				// vm.data.especialidades = orderByFilter(vm.data.especialidades, vm.order.value, vm.order.reverse);

				vm.filter.especialidades = $filter('filter')
					(vm.data.especialidades, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombrePrestacion

					});

				vm.paginacion.totalItems = vm.filter.especialidades.length;
				vm.filter.especialidades = vm.filter.especialidades.slice(begin, end);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');

				vm.formControl.loading = true;

				EspecialidadMedicaDataService.getAll()
				.then(successCallback, errorCallback);
				
	 			function successCallback (pResults) {
					 vm.data.especialidades = pResults;
					 
					 cleanFilters();
					 vm.paginacion.currentPage = 1;
					 vm.paginacion.pageSize = 6;
					 vm.paginacion.getPage();
					 vm.formControl.loading = false;
					 vm.formControl.stateLoading = false;
	 				
	 				vm.formControl.loading = false;
	 				vm.formControl.error = false;
	 				$log.debug('Inicializar OK.-', pResults);
	 			}

	 			function errorCallback (pError) {
	 				vm.formControl.loading = false;
	 				vm.formControl.error = true;
	 				$log.error('Inicializar ERROR.-', pError);
	 				ModalService.error(pError.message);
	 			}
			}

		}
	};

	return module;

})();