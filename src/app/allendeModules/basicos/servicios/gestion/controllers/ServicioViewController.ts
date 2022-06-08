/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('ServicioViewController', ServicioViewController);

		// Inyección de Dependencia
		ServicioViewController.$inject = ['Logger', '$uibModalInstance', 'ServiciosGestionDataService', 'IdServicioSelected'];

		// Constructor del Controller
		function ServicioViewController ($log, $uibModalInstance, ServiciosGestionDataService, IdServicioSelected) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServicioViewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				idServicioSelected : IdServicioSelected,
				servicio: {}
			}

			vm.formControl = {
				loadingCalle: false,
				error: true,
				loading: false,
				edit : editOption,
				delete : deleteOption
				//ok: returnDomicilio,
				
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function editOption (pCama) {
				
			}

			function deleteOption (pCama) {
			
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}


 			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();
			
			function activate () {
				$log.debug('Inicializar idServicioSelected ON.-',vm.data.idServicioSelected);
				vm.formControl.loading = true;

				var _servicio = ServiciosGestionDataService.getServicioById(vm.data.idServicioSelected)
				.then(activateOk, activateError);
					
				function activateOk (pResults) {
						
					vm.data.servicio = pResults;
					$log.debug('Inicializar pResults ON.-');

						vm.formControl.loading = false;

				}

				function activateError (pError) {
				

					vm.formControl.loading = false;

					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}
		};
	};

	return module;

})();