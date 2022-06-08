/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SelectAllCamaController', SelectAllCamaController);

		// Inyección de Dependencia
		SelectAllCamaController.$inject = ['$scope','Logger', '$q', '$uibModalInstance', 'HabitacionGestionDataService',
			'IdHabitacionSelected', 'ModalService'];

		// Constructor del Controller
		function SelectAllCamaController ($scope,$log, $q, $uibModalInstance, HabitacionGestionDataService, 
			IdHabitacionSelected, ModalService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SelectAllCamaController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			
			$scope.data = {
				idHabitacionSelected : IdHabitacionSelected,
				habitaciones: [],
				camas: [],
				categoriasHabitacion : [],
				tiposHabitacionFisica : []
			};

			vm.formControl = {
				loadingCalle: false,
				error: true,
				loading: false,
				edit : editCama,
				delete : deleteCama
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function editCama (pCama) {

				$log.debug('Inicializar ON.-', pCama);
			}

			function deleteCama (pCama) {

			var _id = pCama.id_cama;
			
			ModalService.confirm('¿Desea eliminar la Cama ' + pCama.numero_cama +'?',
				function (pResult) {
					if (pResult) {
						// HabitacionGestionDataService.deleteHabitacion(pHabitacion)
						// .then(function (pDato) {
						// ModalService.success("Habitacion Borrada");
						// })
						// .catch(function (pError) {
						// $log.error('deleteHabitacion .-', pError);
						// });
						// 
						activate();

					}
				});	
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			// function inicializarVariables () {
			// 	vm.formControl.esEdit = false;
			// 	vm.formControl.esNew = false;
			// }

 			/* --------------------------------------------- ACTIVATE --------------------------------------------- */
			
			activate();
 				
			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				HabitacionGestionDataService.getAllCamasById(IdHabitacionSelected)
				.then(activateOk, activateError);
					
				function activateOk (pResults) {
					 
					$scope.data.camas = pResults;

					 vm.formControl.loading = false;
					// $scope.formControl.stateLoading = false;
				}

				function activateError (pError) {
					// $scope.formControl.loading = false;
					// $scope.formControl.stateLoading = false;
						vm.formControl.loading = false;

					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}

				//inicializarVariables();
			}
		}
	};

	return module;

})();