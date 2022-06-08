/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('ServicioNewController', ServicioNewController);

		// Inyección de Dependencia
		ServicioNewController.$inject = ['Logger', '$uibModalInstance', 'ServiciosGestionDataService', 'ModalService'];

		// Constructor del Controller
		function ServicioNewController($log, $uibModalInstance,	ServiciosGestionDataService, ModalService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServicioNewController');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				servicio: {},
			};

			vm.formControl = {
				ok: guardarServicio,
				cancel: cancel,
				loadingCalle: false,
				error: true,
				loading: false
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			function inicializarVariables() {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
			}

			function guardarServicio(isValid) {
				if (isValid) {
					var _servicio = vm.data.servicio;
					vm.formControl.loading = true;
					ServiciosGestionDataService.validarNewServicio(_servicio)
						.then(addOk, addError);
				}
				function addOk(pResponse) {
					if (pResponse.IsOk === true) {
						vm.formControl.loading = true;
						ServiciosGestionDataService.newServicio(_servicio)
							.then(function(pResp) {
								vm.formControl.loading = false;
								$uibModalInstance.close("result ok");
								ModalService.success("Servicio Creado");
								activate();
							}).catch(function(pErr) {
								vm.formControl.loading = false;
								ModalService.error("Error de servidor");
								$uibModalInstance.dismiss(pErr);
							});
					} else {
						if (pResponse.Message != null)
							ModalService.error(pResponse.Message);
						else
							ModalService.error("Error de servidor");
						vm.formControl.loading = false;
					}
					vm.formControl.loading = false;
				}
				function addError(pError) {
					$uibModalInstance.dismiss(pError);
				}
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {
				function activateOk(pResults) {
					$log.debug('Inicializar Modal OK.-');
				}
				function activateError(pError) {
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar Modal ERROR.-', pError);
				}
			}
			function activateError(pError) {
				$uibModalInstance.dismiss(pError);
			}
		}
	};

	return module;

})();