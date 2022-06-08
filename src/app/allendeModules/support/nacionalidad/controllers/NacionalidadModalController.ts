/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('NacionalidadModalController', NacionalidadModalController);

		// Inyección de Dependencia
		NacionalidadModalController.$inject = ['Logger', '$q', '$uibModalInstance', 'NacionalidadDataService', 
												'Nacionalidad','SupportDataService'];

		// Constructor del Controller
		function NacionalidadModalController ($log, $q, $uibModalInstance, NacionalidadDataService, Nacionalidad,
											SupportDataService: ISupportDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('NacionalidadModalController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;

				vm.formData = {
					nacionalidad : {}
				};

				vm.data = {
					paises : [],
					tiposNacionalidad : [],
					tiposNacionalizado : []
				};

				vm.formControl = {
					loadingCalle: false,
					error: true,
					loading: false,
					esEdit : false,
					esNew : false,
					ok: returnNacionalidad,
					cancel: cancel
				};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

 				/* FORMULARIO */

 				function cancel () {
 					$uibModalInstance.dismiss('cancel');
 				}

				function returnNacionalidad(isValid) {
					if (isValid) {
						var _nacionalidad = crearNacionalidad();
						if (vm.formControl.esEdit)
							angular.copy(vm.formData.nacionalidad, Nacionalidad);
						
						$log.debug('returnNacionalidad', _nacionalidad);
						$uibModalInstance.close(_nacionalidad);
					}
 				}

 				function crearNacionalidad () {
 					var _nacionalidad = vm.formData.nacionalidad; 	
 					//$log.debug('FormData.nacionalidad', vm.formData.nacionalidad);
					_nacionalidad.TipoNacionalidadNombre = vm.formData.tipoNacionalidad.Nombre;
					_nacionalidad.IdTipoNacionalidad = vm.formData.tipoNacionalidad.Id;
					_nacionalidad.TipoNacionalizadoNombre = vm.formData.tipoNacionalizado.Nombre;
					_nacionalidad.IdPais = vm.formData.pais.Id;
					_nacionalidad.PaisNombre = vm.formData.pais.Nombre;
 					
 					//$log.debug('nacionalidad', _nacionalidad);
 					return _nacionalidad;
 				} 				

 				/* ------------------------------ ACTIVATE ------------------------------ */

				function inicializarVariables () {
 					vm.formControl.esEdit = false;
 					vm.formControl.esNew = false;
 				}

 				activate();
 				
				function activate () {
					$log.debug('Inicializar ON.-');
					vm.formControl.loading = true;

					var _paises = SupportDataService.obtenerTodosPaises();
					var _tiposNacionalidad  = NacionalidadDataService.getAllTiposNacionalidad();
					var _tiposNacionalizado = NacionalidadDataService.obtenerTodosTiposNacionalizados();

					inicializarVariables();


					$q.all([_paises, _tiposNacionalidad, _tiposNacionalizado])
					.then(activateOk, activateError);
				}

				function activateOk (pReponse) {
					vm.data.paises = pReponse[0];
					vm.data.tiposNacionalidad = pReponse[1];
					vm.data.tiposNacionalizado = pReponse[2];

					vm.formControl.loading = false;

					angular.copy(Nacionalidad, vm.formData.nacionalidad);

					if (Nacionalidad && (Nacionalidad.Id || Nacionalidad.$$hashKey)) {
						$log.debug('Nacionalidad que llega ', Nacionalidad);
						vm.formData.nacionalidad.$$hashKey = Nacionalidad.$$hashKey;
						vm.formControl.esEdit = true;
						vm.formData.pais = Nacionalidad.Pais;

					} else {
						vm.formControl.esNew = true;
						vm.formData.pais = {
							Id : Nacionalidad.IdPais,//12,
							Nombre : Nacionalidad.PaisNombre//'ARGENTINA'
						};

						vm.formData.tipoNacionalidad = {
							Id : Nacionalidad.IdTipoNacionalidad,//1,
							Nombre : Nacionalidad.TipoNacionalidadNombre//'Originaria'
						};						
						vm.formData.tipoNacionalizado = {
							Id : Nacionalidad.IdTipoNacionalizado,//1,
							Nombre : Nacionalidad.TipoNacionalizadoNombre//'Paciente'
						};	
					}

					$log.debug('Inicializar OK.-', pReponse);
				}

				function activateError (pError) {
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-');
				}
			}
	};

	return module;

})();