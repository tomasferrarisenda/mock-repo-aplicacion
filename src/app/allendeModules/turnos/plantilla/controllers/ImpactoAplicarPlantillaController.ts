/**
 * @author:			Pablo Pautasso
 * @description:	controller para modal de impacto de aplicar plantilla
 * @type:			Controller
 **/

export default (function () {
   'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ImpactoAplicarPlantillaController', ImpactoAplicarPlantillaController);

		ImpactoAplicarPlantillaController.$inject = [
			'$location', 'Logger', '$q', '$filter', '$uibModalInstance',
			'ModalService', 'Plantilla'
		];

		function ImpactoAplicarPlantillaController (
			$location,  $log, $q, $filter, $uibModalInstance,
			ModalService, Plantilla) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ImpactoAplicarPlantillaController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {

			};

			vm.data = {
				plantilla : Plantilla
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false,
				error : true,				
				reloadPage : activate,
				ok : methodSave,
				cancel : cancel
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function inicializarVariables () {
			}
			
			function llenarForm () {
			}

			function methodSave () {
				$uibModalInstance.close(true);
			}

			function cancel () {
				$uibModalInstance.dismiss('close');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');

				$log.error('vm.data.plantilla',vm.data.plantilla);

				// $q.all([])
				// .then(successCallback, errorCallback);
				
	 			function successCallback (pResults) {
	 				// variable = pResult[0];
	 				
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