/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('CamaNewController', CamaNewController);

		// Inyección de Dependencia
		CamaNewController.$inject = ['$scope','Logger', '$q', '$uibModalInstance', 
		'CamaGestionDataService','ModalService',
		'HabitacionGestionDataService',
		'HabitacionGestionLogicService',
		'IdHabitacionSelected'

		];

		// Constructor del Controller
		function CamaNewController ($scope,$log, $q, $uibModalInstance, 
			CamaGestionDataService,ModalService,
			HabitacionGestionDataService,
			HabitacionGestionLogicService,
			IdHabitacionSelected
			) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CamaNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.formData = {
				domicilio : {}
			};

			$scope.data = {
					idHabitacionSelected : IdHabitacionSelected,
					edificios : {},
					habitacion: {},
					categoriasHabitacion : [],
					tiposHabitacionFisica : []
			};

			vm.data = {
				cama: {},
				edificios: {},
				habitacion: {}
			};

			vm.formControl = {
				ok: guardarCama,
				cancel: cancel,
				loadingCalle: false,
				error: true,
				loading: false,
				sucursalCheck: false,
				pisosCheck: false
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			function guardarCama () {
					
				var _cama = vm.data.cama;
				
				_cama.IdHabitacion = vm.data.habitacion.Id;

				$log.debug(' GuardarCama _cama - ', _cama);						
				// ModalService.success("Cama Creada");
				// $uibModalInstance.dismiss();

				HabitacionGestionDataService.newCama(_cama)
				.then(addOk, addError);
				
				function addOk (pResults) {

					ModalService.success("Cama Creada");
					$uibModalInstance.dismiss();

					$log.debug(' GuardarCama OK-',pResults);						
				}

				function addError (pError) {
					// $scope.formControl.loading = false;
					// $scope.formControl.stateLoading = false;
					ModalService.error("Error de servidor");

					$uibModalInstance.dismiss(pError);
					$log.error(' GuardarCama ERROR.-', pError);
				}
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

				activate();
				
				function activate () {
				$log.debug('Inicializar ON.-');
				// vm.formControl.loading = true;

				HabitacionGestionDataService.getOne(IdHabitacionSelected)
				.then(activateOk, activateError);
					
				function activateOk (pResults) {

					$log.debug('Inicializar OK.-',pResults);

					vm.data.habitacion = pResults;

				}

				function activateError (pError) {
				
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}
		}
	};

	return module;

})();