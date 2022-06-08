/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('TelefonoModalController', TelefonoModalController);

		// Inyección de Dependencia
		TelefonoModalController.$inject = ['Logger', '$q', '$uibModalInstance', 'TelefonoDataService', 'DomicilioDataService', 'Telefono'];

		// Constructor del Controller
		function TelefonoModalController ($log, $q, $uibModalInstance, TelefonoDataService, DomicilioDataService, Telefono) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TelefonoModalController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;

				vm.formData = {
					telefono : {},
					maxlength : 10,
					minlength : 5,
				};

				vm.data = {
					paises : [],
					codigosArea : [],
					tiposUsoTelefono : [],
					tiposEquipoTelefono : []
				};

				vm.formControl = {
					error: true,
					loading: false,
					esEdit : false,
					esNew : false,
					ok: returnTelefono,
					cancel: cancel,
					cargarCodigosArea : cargarCodigosArea,
				};

				/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

 				/* FORMULARIO */

 				function cancel () {
 					$uibModalInstance.dismiss('cancel');
 				}

 				function returnTelefono () {
 					var _telefono = crearTelefono();

 					if (vm.formControl.esEdit)
 						angular.copy(vm.formData.telefono, Telefono);

 					$uibModalInstance.close(_telefono);
 				}

 				function crearTelefono () {
 					var _telefono = vm.formData.telefono;

 					return _telefono;
 				}

 				function cargarCodigosArea (idPais) {
 					if (idPais) {
	 					TelefonoDataService.getAllCodigoAreaByPais(idPais)
	 					// TelefonoDataService.getAllCodigoArea()
	 					.then(function (pCodigosArea) {

	 						vm.data.codigosArea = pCodigosArea;
	 						
	 						vm.formData.maxlength = 10;

	 						if (pCodigosArea.length == 1) {
	 							vm.formData.telefono.CodigoArea = pCodigosArea[0];
	 						} else if (pCodigosArea.length == 0) {
	 							vm.formData.maxlength = 15;
	 						}

	 					}, function (pError) {
	 						$log.error(pError);
	 					});
 					} else {
 						vm.data.codigosArea = [];
 					}
 				}

 				function inicializarVariables () {
 					vm.formControl.esEdit = false;
 					vm.formControl.esNew = false;
 				}

 				/* ------------------------------ ACTIVATE ------------------------------ */

 				activate();
 				
				function activate () {
					$log.debug('TelefonoModalController: Inicializar ON.-');
					vm.formControl.loading = true;

					var _paises = DomicilioDataService.getAllPaises();
					var _tiposUso = TelefonoDataService.getAllTipoUsoTelefono();
					var _tiposEquipo = TelefonoDataService.getAllTipoEquipoTelefono();

					inicializarVariables();


					$q.all([_paises, _tiposUso, _tiposEquipo])
					.then(function (pReponse) {
						vm.data.paises = pReponse[0];
						vm.data.tiposUsoTelefono = pReponse[1];
						vm.data.tiposEquipoTelefono = pReponse[2];
						vm.formControl.loading = false;

						if (Telefono) {
							$log.debug('Telefono que llega ', Telefono);
							vm.formControl.esEdit = true
							cargarCodigosArea(Telefono.CodigoArea.Pais.id_pais);
							vm.formData.pais = Telefono.CodigoArea.Pais;
							angular.copy(Telefono, vm.formData.telefono);

						} else {
							vm.formControl.esNew = true;
							vm.formData.pais = {
								id_pais : 12
							};
							vm.formData.telefono.TipoTelefono = {
								id_tipo_telefono : 39
							};
							cargarCodigosArea(12);
						}

						$log.debug('TelefonoModalController: Inicializar OK.-', pReponse);
					}, function (pError) {
						$uibModalInstance.dismiss(pError);
					})
				}
			};
	};

	return module;

})();