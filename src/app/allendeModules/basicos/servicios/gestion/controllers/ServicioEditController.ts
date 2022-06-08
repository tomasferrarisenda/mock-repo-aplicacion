/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('ServicioEditController', ServicioEditController);

		// Inyección de Dependencia
		ServicioEditController.$inject = ['Logger', '$uibModalInstance', 'ServiciosGestionDataService', 'ModalService',
			'IdServicioSelected'
		];

		// Constructor del Controller
		function ServicioEditController($log, $uibModalInstance, ServiciosGestionDataService, ModalService,
			IdServicioSelected) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServicioEditController');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			
			vm.data = {
				servicio: {},
			};

			vm.formControl = {
				ok: guardarServicioEditado,
				cancel: cancel,
				error: true,
				loading: false,
				sucursalCheck: false,
				pisosCheck: false,
				buildingData: false
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function cancel() {
				$uibModalInstance.close('cancel');
			}

			function inicializarVariables() {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
				vm.formControl.buildingData = false;
			}

			function guardarServicioEditado(isValid) {
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
								ModalService.success("Servicio Editado");
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
				};

			}
			
			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				var _servicioLoaded = ServiciosGestionDataService.getServicioById(IdServicioSelected)
					.then(activateOk, activateError);

				function activateOk(pResults) {
					$log.debug('Inicializar OK.-', pResults);
					vm.data.servicio = pResults;
					$log.debug('vm.data.servicio.-', vm.data.servicio);
					vm.formControl.loading = false;
				}

				function activateError(pError) {
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}


		};
	};

	return module;

})();