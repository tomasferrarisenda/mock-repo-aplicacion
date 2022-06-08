/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('HabitacionNewController', HabitacionNewController);

		// Inyección de Dependencia
		HabitacionNewController.$inject = ['$scope','Logger', '$q', '$uibModalInstance', 
		'CamaGestionDataService','ModalService',
		'HabitacionGestionDataService'];

		// Constructor del Controller
		function HabitacionNewController ($scope,$log, $q, $uibModalInstance, 
			CamaGestionDataService,ModalService,
			HabitacionGestionDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('HabitacionNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.formData = {
				domicilio : {}
			};

			$scope.data = {
					edificios : {},
					habitaciones: [],
					camas: [],
					categoriasHabitacion : [],
					tiposHabitacionFisica : []
			};

			vm.data = {
				edificios: {},
				habitacion: {}

			};

			vm.formControl = {
				getEdificio : getEdificio,
				getPisos : getPisos,
				ok: guardarHabitacion,
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

			function inicializarVariables () {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
			}


			function getEdificio (pSucursal) {

				if(pSucursal)
				{
					vm.sucursalCheck = true;

				}
				else{
					vm.sucursalCheck = false;
					vm.pisosCheck = false;
				}

				if (pSucursal) {
					HabitacionGestionDataService.getAllEdificioBySucursalId(pSucursal.id_sucursal)
					.then(successCallback, errorCallback);					
				} else {
					$log.debug('No viene los edificios');
				}

				function successCallback (pEdificio) {
					$scope.data.edificios = pEdificio;
					//vm.edificios = pEdificio;
				
					$log.debug('getEdificio OK.- ', $scope.data.edificios);
				}

				function errorCallback (pError) {
					$log.error('getEdificio error.- ', pError);

				}
			}

			function getPisos (pEdificio) {

				if(pEdificio)
					vm.pisosCheck = true;
				else
					vm.pisosCheck = false;


				if (pEdificio) {
					HabitacionGestionDataService.getAllPisosByEdificioId(pEdificio.Nombre.Id)
					.then(successCallback, errorCallback);					
				} else {
					$log.debug('No viene los pisos');
				}

				function successCallback (pPisos) {
					$scope.data.pisos = pPisos;
					vm.pisos = pPisos;
				
					$log.debug('getPisos OK.- ', $scope.data.pisos);
				}

				function errorCallback (pError) {
					$log.error('getPisos error.- ', pError);

				}
			}


			function guardarHabitacion () {
 					
				var _habitacion = vm.data.habitacion;
				
				_habitacion.IdPiso = $scope.data.pisos.Descripcion.Id;

				_habitacion.IdTipoHabitacionFisica = 
					$scope.data.tiposHabitacionFisica.nombre_tipo_habitacion.id_tipo_habitacion_fisica;
				vm.formControl.loading = true;
				HabitacionGestionDataService.newHabitacion(_habitacion)
				.then(addOk, addError);
				
				function addOk (pResults) {

					ModalService.success("Habitacion Creada");
					$uibModalInstance.close("result ok");
					vm.formControl.loading = false;
					$log.debug(' GuardarHabitacion OK-',pResults);						
				}

				function addError (pError) {
					// $scope.formControl.loading = false;
					// $scope.formControl.stateLoading = false;
					ModalService.error("Error de servidor");
						
					$uibModalInstance.dismiss(pError);
					$log.error(' GuardarHabitacion ERROR.-', pError);
				}
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();
				
			function activate () {
				$log.debug('Inicializar ON.-');
				// vm.formControl.loading = true;

				CamaGestionDataService.getAllTiposHabitacionFisica()
				.then(activateOk, activateError);
					
				function activateOk (pResults) {

					$log.debug('Inicializar OK.-');

					$scope.data.tiposHabitacionFisica = pResults;
				}

				function activateError (pError) {
				
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
				//inicializarVariables();
			}
		}
	};

	return module;

})();