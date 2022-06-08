/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('TelefonosModalController', TelefonosModalController);

		// Inyección de Dependencia
		TelefonosModalController.$inject = ['Logger', '$q', '$uibModalInstance', 'TelefonosDataService',
											'DomicilioDataService', 'Telefonos'];

		// Constructor del Controller
		function TelefonosModalController ($log, $q, $uibModalInstance, TelefonosDataService, 
											DomicilioDataService, Telefonos) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TelefonosModalController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;

				vm.formData = {
					telefono : {},
					maxlength : 0,
					minlength : 0,
					maxlengthCodigoArea: 0,
					minlengthCodigoArea: 0,
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

				function returnTelefono(isValid) {
					if (isValid) {
 					var _telefono = crearTelefono(); 
 				
					if (vm.formControl.esEdit) 					
 						angular.copy(_telefono, Telefonos);

					$log.debug('return _telefono'  ,_telefono);
					 $uibModalInstance.close(_telefono);
					}
 				}

 				function crearTelefono () {
 					//$log.debug('crearTelefono ',Telefonos);
 					vm.formData.telefono.TelefonoCompleto = 
							 (vm.formData.telefono.CodigoArea + vm.formData.telefono.Numero);
					 var _telefono = vm.formData.telefono;

					 if(!_telefono.PaisTelefono){
						_telefono.PaisTelefono = {};
					 }
					_telefono.PaisTelefono.CodigoTelefono = vm.formData.pais.codigo_telefono;
					_telefono.PaisTelefono.Id = vm.formData.pais.id_pais;
					_telefono.PaisTelefono.Nombre = vm.formData.pais.nombre_pais;
					 // por el momento solo guardo los id de las localidades de argentina y con esto se obtiene
					 // el codigo de area y codigo de pais.
					 // para el resto de los paises guardo el texto de codigo de area y id de pais
					if(_telefono.PaisTelefono.Id != 12) 		_telefono.IdLocalidad = 0;

 					return _telefono;
 				}

 				function cargarCodigosArea (idPais) {
 					if (idPais) {
	 					TelefonosDataService.getAllCodigoAreaByPais(idPais)
	 					.then(cargarCodigosAreaOk, cargarCodigosAreaError);
 					} else {
 						vm.data.codigosArea = [];
 					}

 					function cargarCodigosAreaOk(pCodigosArea) {
 						vm.data.codigosArea = pCodigosArea;
 						vm.formData.maxlength = 10;

 						if (pCodigosArea.length == 1) {
 							vm.formData.telefono.CodigoArea = pCodigosArea[0];
 						} else if (pCodigosArea.length == 0) {
 							vm.formData.maxlength = 15;
 						}
 					}

 					function cargarCodigosAreaError(pError) {
 						$log.error(pError);
 					}
 				}

 				function inicializarVariables () {
 					vm.formControl.esEdit = false;
 					vm.formControl.esNew = false;
 				}

 				/* ------------------------------------------- ACTIVATE ------------------------------------------- */

 				activate();
 				
				function activate () {
					$log.debug('TelefonosModalController: Inicializar ON.-');
					vm.formControl.loading = true;

					var _paises = DomicilioDataService.getAllPaises();
					var _tiposUso = TelefonosDataService.getAllTipoUsoTelefono();
					var _tiposEquipo = TelefonosDataService.getAllTipoEquipoTelefono();

					inicializarVariables();


					$q.all([_paises, _tiposUso, _tiposEquipo])
					.then(function (pReponse) {
						vm.data.paises = pReponse[0];
						vm.data.tiposUsoTelefono = pReponse[1];
						vm.data.tiposEquipoTelefono = pReponse[2];
						vm.formControl.loading = false;
						
						//$log.debug('Telefono que llega 1', Telefonos);
						vm.formData.telefono = angular.copy(Telefonos);

						if (Telefonos.Id > 0 || ((Telefonos.Numero != null) && (Telefonos.Numero.length > 0))){
							$log.debug('Telefono que llega ', Telefonos);
							vm.formControl.esEdit = true;
							vm.formData.telefono.$$hashKey = Telefonos.$$hashKey;
							//$log.debug('Telefono que llega (1)', vm.formData);
						} else {
							vm.formControl.esNew = true;
						}
						//nuevo para ado
						if(!Telefonos.PaisTelefono){
							Telefonos.PaisTelefono = vm.data.paises.find(x => x.id_pais === 12);
							Telefonos.PaisTelefono.Id = angular.copy(Telefonos.PaisTelefono.id_pais);
						}
						
						vm.formData.pais =  {
						 		id_pais : Telefonos.PaisTelefono.Id,
								nombre_pais : Telefonos.PaisTelefono.Nombre,
								codigo_telefono : Telefonos.PaisTelefono.CodigoTelefono
						 };
						vm.formData.telefono.TipoEquipo =  Telefonos.TipoEquipo;
						vm.formData.telefono.TipoUso =  Telefonos.TipoUso;
						vm.formData.maxlength   = Telefonos.MaxLargoTelefono;
						vm.formData.minlength   = Telefonos.MinLargoTelefono;
						vm.formData.maxlengthCodigoArea = Telefonos.MaxLargoCodigoArea;
						vm.formData.minlengthCodigoArea = Telefonos.MinLargoCodigoArea;
						// fin nuevo para ado
						$log.debug('TelefonosModalController: Inicializar OK.-', pReponse);
					}, function (pError) {
						$uibModalInstance.dismiss(pError);
					});
				}
			}
	};
	return module;
})();