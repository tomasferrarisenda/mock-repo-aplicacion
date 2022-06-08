/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PreadmisionTemplateListController', PreadmisionTemplateListController);

		PreadmisionTemplateListController.$inject = ['Logger', '$q', '$filter', 'PreadmisionDataService',
			'Title', 'Module', '$uibModalInstance', 'NumeroMatricula'];

		function PreadmisionTemplateListController ($log, $q, $filter, PreadmisionDataService,
			Title, Module, $uibModalInstance, NumeroMatricula) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionTemplateListController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;

			vm.title = {
				module : Module,
				page : Title
			};

			vm.formData = {
				plantillaSeleccionada : null
			};

			vm.data = {
				internaciones : []
			};

			vm.filter = {
				internaciones : [],
				nombreTemplate : '',
				clean : cleanFilters
			}

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged : getPage,
				getPage : getPage
			}

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate,
				ok : returnPlantillas,
				cancel : cancel
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function inicializarVariables () {
				// Inicializar data y formData.
			}

			function returnPlantillas () {
				vm.formControl.loading = true;
				PreadmisionDataService.getOneSolicitudPreadmision(vm.formData.plantillaSeleccionada.Id)
				.then(internacion => {
					vm.formControl.loading = false;
					$uibModalInstance.close(internacion);
					}, () => vm.formControl.loading = false);
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			/* PAGINACIÓN */

			function cleanFilters () {
				vm.filter.nombreTemplate = '';
			}

			function validarFilters () {
				if (vm.filter.nombreTemplate == null) {
					vm.filter.nombreTemplate = '';
				}
			}

			function getPage () {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				validarFilters();
				vm.filter.internaciones = $filter('filter')
				(vm.data.internaciones,{
					NombreTemplate : vm.filter.nombreTemplate
				});
				vm.paginacion.totalItems = vm.filter.internaciones.length;
				vm.filter.internaciones = vm.filter.internaciones.slice(begin, end);
					//$log.debug('GetPage OK.-');
				}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-');
				inicializarVariables();
				vm.formControl.loading = true;

				PreadmisionDataService.getAllTemplateByMedico(NumeroMatricula)
				.then(activateOk, activateError)
			}

			function activateOk (pResult) {
				vm.data.internaciones = pResult;
				vm.paginacion.pageSize = 5;
				vm.paginacion.currentPage = 1;
				getPage();
				vm.formControl.loading = false;
			}

			function activateError (pError) {
				vm.formControl.loading = false;
				vm.formControl.error = true;
			}
		};
	};

	return module;

})();