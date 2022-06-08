/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PreadmisionCantidadDiasController', PreadmisionCantidadDiasController);

		// Inyeccion de dependencia
		PreadmisionCantidadDiasController.$inject = ['Logger', '$q', '$uibModalInstance', 'CamaDataService',
		'DiasInternacion', 'User'];
		
		// Constructor del Controller
		function PreadmisionCantidadDiasController ($log, $q, $uibModalInstance, CamaDataService,
		DiasInternacion, User) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionCantidadDiasController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				categoriasHabitacion : []
			};

			vm.formData = {
				cantidadDias : []
			};

			vm.formControl = {
				loading : false,
				validarOk : validarForm,
				cancel : cancelarModal,
				ok : cargarCantidadDias
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

				function validarForm () {
					var _flag = false;
					return _flag;
				}

				function cargarCantidadDias () {
					$uibModalInstance.close(vm.formData.cantidadDias);
				}

				function cancelarModal (pError) {
					$uibModalInstance.dismiss('Anulación cancelada.');
				}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

				activate();

				function activate () {
					vm.formControl.loading = true;
					$log.debug('Inicializar ON.-');

					CamaDataService.getAllCategoriasHabitacionForDias()
					.then(successCallback, errorCallback);

					function successCallback (pCategorias) {
						vm.formControl.loading = false;
						vm.data.categoriasHabitacion = pCategorias;
						var _dia;
						for (var i = 0; i < vm.data.categoriasHabitacion.length; i++) {
							
							_dia = {
								id_categoria_habitacion : vm.data.categoriasHabitacion[i].id_categoria_habitacion,
								cantidad_dias : 0
							};
							if (DiasInternacion && DiasInternacion.length) {
								for (var j = 0; j < DiasInternacion.length; j++) {
									if (DiasInternacion[j].id_categoria_habitacion == _dia.id_categoria_habitacion) {
										_dia.cantidad_dias = DiasInternacion[j].cantidad_dias;
										break;
									}
								}
							}

							vm.formData.cantidadDias.push(_dia);
						}
					}

					function errorCallback (pError) {
						cancelarModal(pError);
					}
				}
			}
		};

	return module;

})();