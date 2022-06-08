/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('HabitacionEditController', HabitacionEditController);

		// Inyección de Dependencia
		HabitacionEditController.$inject = ['$scope','Logger', '$q', '$uibModalInstance', 
		'CamaGestionDataService','ModalService',
		'HabitacionGestionDataService',
		'HabitacionGestionLogicService',
		'IdHabitacionSelected'
		];

		// Constructor del Controller
		function HabitacionEditController ($scope,$log, $q, $uibModalInstance, 
			CamaGestionDataService,ModalService,
			HabitacionGestionDataService,
			HabitacionGestionLogicService,
			IdHabitacionSelected
			) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('HabitacionEditController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

		
			$scope.data = {
				idHabitacionSelected : IdHabitacionSelected,
				edificios : {},
				habitaciones: [],
				camas: [],
				categoriasHabitacion : [],
				tiposHabitacionFisica : [],
				habitacionLoaded : []
			};

			vm.data = {
				piso: {},
				habitacionLoaded: {},
				edificios: {},
				habitacion: {}

			};

			vm.formControl = {
				getPiso : getPiso,
				ok: guardarHabitacionEditada,
				cancel: cancel,
				error: true,
				loading: false,
				sucursalCheck: false,
				pisosCheck: false,
				buildingData : false
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			function inicializarVariables () {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
				vm.formControl.buildingData = false;
			}


 			// 	function getEdificio (pSucursal) {

			// 			if(pSucursal)
			// 			{
			// 				vm.sucursalCheck = true;

			// 			}
			// 			else{
			// 				vm.sucursalCheck = false;
			// 				vm.pisosCheck = false;
			// 			}

			// 			if (pSucursal) {
			// 				HabitacionGestionDataService.getAllEdificioBySucursalId(pSucursal.id_sucursal)
			// 				.then(successCallback, errorCallback);					
			// 			} else {
			// 				$log.debug('No viene los edificios');
			// 			}

			// 			function successCallback (pEdificio) {
			// 				$scope.data.edificios = pEdificio;
			// 				//vm.edificios = pEdificio;
						
			// 				$log.debug('getEdificio OK.- ', $scope.data.edificios);
			// 			}

			// 			function errorCallback (pError) {
			// 				$log.error('getEdificio error.- ', pError);

			// 			}
			// }

			function getPiso (pIdPiso) {

				HabitacionGestionDataService.getOnePiso(pIdPiso)
					.then(successCallback, errorCallback);					
				
				function successCallback (pPiso) {
					vm.data.piso = pPiso;
				
					$log.debug('getPiso OK.- ', vm.data.piso);
				}

				function errorCallback (pError) {
					$log.error('getPiso error.- ', pError);

				}
			}


			function guardarHabitacionEditada () {
				

				$log.debug(' guardarHabitacionEditada - ',vm.data.habitacionLoaded);		

				var _habitacion = vm.data.habitacionLoaded;

				HabitacionGestionDataService.editHabitacion(_habitacion)
				.then(addOk, addError);
				
				function addOk (pResults) {

					ModalService.success("Habitacion Editada Correctamente");
					$uibModalInstance.close();

					$log.debug(' EditarHabitacion OK-',pResults);						
				}

				function addError (pError) {
					// $scope.formControl.loading = false;
					// $scope.formControl.stateLoading = false;

					$uibModalInstance.dismiss(pError);
					$log.error(' EditarHabitacion ERROR.-', pError);
				}
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();
				
			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				var _habitacionLoaded = HabitacionGestionDataService.getOne(IdHabitacionSelected);
				var _tiposHabitacionFisica = CamaGestionDataService.getAllTiposHabitacionFisica();


				$q.all([_habitacionLoaded,_tiposHabitacionFisica])
				.then(activateOk, activateError);
					
				function activateOk (pResults) {

					$log.debug('Inicializar OK.-',pResults);

					vm.data.habitacionLoaded = pResults[0];
					$log.debug('vm.data.habitacionLoaded.-',vm.data.habitacionLoaded);

					vm.data.tiposHabitacionFisica = pResults[1];
					$log.debug('vm.data.tiposHabitacionFisica.-',vm.data.tiposHabitacionFisica);
					getPiso(vm.data.habitacionLoaded.IdPiso);

					vm.formControl.loading = false;
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