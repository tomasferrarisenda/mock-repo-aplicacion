/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('PrestacionEditController', PrestacionEditController);

		// Inyección de Dependencia
		PrestacionEditController.$inject = ['Logger', '$q', '$uibModalInstance', 'PrestacionGestionDataService', 'IdPrestacionSelected',
		'ModalService'];

		// Constructor del Controller
		function PrestacionEditController ($log, $q, $uibModalInstance, PrestacionGestionDataService, IdPrestacionSelected,
			ModalService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrestacionEditController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				idPrestacionSelected : IdPrestacionSelected,
				prestacion: {
					
				},
				prefacturables: {},
				preFacturable: {},
				prefacturablesList: {},
				tipoPrefacturables: {}

			};

			vm.formControl = {
				loadingCalle: false,
				error: true,
				loading: false,
				ok : guardarPrestacionEditada,
				cancel : cancel				
			};

			


		/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */


			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}


			function guardarPrestacionEditada () {


				var _prestacion = vm.data.prestacion;
			
				vm.formControl.loading = true;

				$log.debug(' GuardarServicioEditado OK-',_prestacion);						


				PrestacionGestionDataService.validarNewPrestacion(_prestacion)
				.then(addOk, addError);
					
					function addOk (pResponse) {

						$log.debug("ValidacionNew",pResponse);

							if(pResponse.IsOk === true){
								vm.formControl.loading = true;
								PrestacionGestionDataService.newPrestacion(_prestacion)
								.then(function (pResp){
								vm.formControl.loading = false;
								$uibModalInstance.close("result ok");
								ModalService.success("Prestacion Editada");
								activate();
							}).catch(function (pErr){
								vm.formControl.loading = false;
								ModalService.error("Error de servidor");
								$uibModalInstance.dismiss(pErr);
								$log.error('ValidacionNew .-', pErr);
							});
							}else{
								if(pResponse.Message != null)
								ModalService.error(pResponse.Message);
								else
								ModalService.error("Error de servidor");
								vm.formControl.loading = false;
								}
						
						vm.formControl.loading = false;
					}

					function addError (pError) {
														
						$uibModalInstance.dismiss(pError);
						$log.error(' GuardarServicioEditado ERROR.-', pError);
					};

			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();
			
			function activate () {
				$log.debug('Inicializar idServicioSelected ON.-',vm.data.idPrestacionSelected);

				vm.formControl.loading = true;

				var _prestacion = PrestacionGestionDataService.getPrestacionById(vm.data.idPrestacionSelected)
				.then(activateOk, activateError);

					function activateOk (pResults) {
							
						vm.data.prestacion = pResults;
						$log.debug('Inicializar prestacion ON.-');
						vm.formControl.loading = false;

					}

					function activateError (pError) {

						vm.formControl.loading = false;

						$uibModalInstance.dismiss(pError);
						$log.error('Inicializar ERROR.-', pError);
					}

				//inicializarVariables();

			}
		};
	};

	return module;
})();