/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('TipoAltaInternacionSelectorController', TipoAltaInternacionSelectorController);

		// Inyección de Dependencia
		TipoAltaInternacionSelectorController.$inject = ['Logger', '$q', '$uibModalInstance', 'InternacionCommonDataService',
		'Title', 'Module', 'User'];

		// Constructor del Controller
		function TipoAltaInternacionSelectorController ($log, $q, $uibModalInstance, InternacionCommonDataService,
			Title, Module, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TipoAltaInternacionSelectorController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				page : Title,
				module : Module
			};

			vm.formData = {
				tipoSeleccionado : ''
			};

			vm.data = {
				tiposAlta : []
			};

			vm.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				valid : validarForm,
				ok: ok,
				cancel : cancel
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function validarForm () {
				if (vm.formData.tipoSeleccionado)
					return true;
				else
					return false;
			}

			function ok () {
				$uibModalInstance.close(vm.formData.tipoSeleccionado);
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			/* ------------------------------ ACTIVATE ------------------------------ */


			activate();
			
			function activate () {
				$log.debug('Inicializar ON.-');
				
				vm.formControl.loading = true;
				
				InternacionCommonDataService.getAllTipoAlta()
				.then(activateOk, activateError);
				
				function activateOk (pResults) {
					vm.formControl.loading = false;
					vm.formControl.error = false;
					vm.data.tiposAlta = pResults;
					$log.debug('Inicializar OK.-');
				}

				function activateError (pError) {
					vm.formControl.error = true;
					$uibModalInstance.dismiss(pError);
				}
			}

		}
	};

	return module;

})();