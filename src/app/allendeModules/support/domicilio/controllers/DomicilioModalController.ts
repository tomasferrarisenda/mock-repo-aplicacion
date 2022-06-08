/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('DomicilioModalController', DomicilioModalController);

		// Inyección de Dependencia
		DomicilioModalController.$inject = ['Logger', '$q', '$uibModalInstance', 'DomicilioDataService', 'Domicilio'];

		// Constructor del Controller
		function DomicilioModalController ($log, $q, $uibModalInstance, DomicilioDataService, Domicilio) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DomicilioModalController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;

				vm.formData = {
					domicilio : {}
				};

				vm.data = {
					paises : [],
					provincias : [],
					localidades : [],
					tiposDomicilios : []
				};

				vm.formControl = {
					loadingCalle: false,
					error: true,
					loading: false,
					esEdit : false,
					esNew : false,
					ok: returnDomicilio,
					cancel: cancel,
					cargarProvincias : cargarProvincias,
					cargarLocalidades : cargarLocalidades,
					getCalles : getAddress,
					getBarrios: getBarrios,
					buscarEnLista : buscarEnLista,
					buscarEnArray : buscarEnArray,
					limpiaLocalidad : limpiaLocalidad,
					limpiaLocalidades : limpiaLocalidades
				};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

 				/* FORMULARIO */

 				function cancel () {
 					$uibModalInstance.dismiss('cancel');
 				}

 				function returnDomicilio (isValid) {
					if (isValid) {
					
 					var _domicilio = crearDomicilio();
 					if (vm.formData.Localidad != null)	{
	 						_domicilio.IdLocalidad = vm.formData.Localidad.Id;
	 						_domicilio.Localidad = vm.formData.Localidad.Nombre;
	 					}	
					_domicilio.IdTipoDomicilio = vm.formData.TipoDomicilio.Id;
					_domicilio.TipoDomicilio = vm.formData.TipoDomicilio.Nombre;
					_domicilio.PaisNombre	=	vm.formData.pais.nombre_pais;
					_domicilio.IdPais		=	vm.formData.pais.id_pais;
					_domicilio.ProvinciaNombre = vm.formData.provincia.Nombre;
					_domicilio.IdProvincia = vm.formData.provincia.Id;

 					if (vm.formControl.esEdit)
 						//angular.copy(vm.formData.domicilio, Domicilio);
 						angular.copy(_domicilio, Domicilio);
					$log.debug('return domicilio'  ,_domicilio);

					 $uibModalInstance.close(_domicilio);
					}
 				}

 				function crearDomicilio () {
 					var _domicilio = vm.formData.domicilio;
 					return _domicilio;
 				}

 				function buscarEnLista (pIndex, pList) {
 					var index = 0;
					for (var i = 0; i < pList.length; i++) {
						if (pList[i].Id == pIndex){
							index = i;
							break;
						}
					}
					return index;
				}

				function buscarEnArray(pIndex,pList){
					var result;
					angular.forEach(pList, function(value){
						if (value.Id == pIndex){
							result = value;
							//$log.debug('buscarArray', result);
						}
					});
					return result;
				}

				function limpiaLocalidad() {
					if (vm.formData.domicilio.LocalidadNombre) {
						vm.formData.Localidad = null;
						vm.formData.domicilio.Localidad = null;
						vm.formData.domicilio.IdLocalidad = null;
					}
				}

				function limpiaLocalidades() {
					if (vm.formData.Localidad) 
						vm.formData.domicilio.LocalidadNombre = null;	
						//$log.debug('!vm.formData.Localidad'  ,vm.formData.Localidad);
						//$log.debug('!vm.formData.domicilio.LocalidadNombre',vm.formData.domicilio);
				}

 				function cargarProvincias (idPais) {
 					if (idPais) {
	 					//DomicilioDataService.getAllProvinciasByPais(idPais)
	 					DomicilioDataService.ObterneProvinciasPorPais(idPais)
	 					.then(function (pProvincias) {

	 						vm.data.provincias = pProvincias;
							$log.debug('vm.data.provincias', vm.data.provincias);

	 						if (pProvincias.length == 1 ) {
	 							vm.formData.provincia = pProvincias[0];
	 							cargarLocalidades(pProvincias[0].id_provincia);
	 						} else if(Domicilio.IdProvincia > 0 ){
								vm.formData.provincia = buscarEnArray(Domicilio.IdProvincia,pProvincias);
	 							cargarLocalidades(Domicilio.IdProvincia);
	 						} else if (vm.formControl.esEdit) {
									if (Domicilio.Localidad.Provincia) {
										vm.formData.provincia = Domicilio.Localidad.Provincia;
										cargarLocalidades(vm.formData.provincia.Id);
									}
	 						}

	 					}, function (pError) {
	 						$log.error(pError);
	 					});
 					} else {
 						vm.data.provincias = [];
 					}
 				}

 				function cargarLocalidades (idProvincia) {
 					if (idProvincia) {
	 					DomicilioDataService.getAllLocalidadesByProvincia(idProvincia)
	 					.then(function (pLocalidades) {
	 						vm.data.localidades = pLocalidades;
	 						if (pLocalidades.length == 1) {
	 							vm.formData.Localidad = pLocalidades[0];
	 						}
	 						else if(Domicilio.IdLocalidad > 0){
	 							//var index = buscarEnLista(Domicilio.IdLocalidad,pLocalidades);
								//vm.formData.Localidad = pLocalidades[index];
								vm.formData.Localidad = buscarEnArray(Domicilio.IdLocalidad,pLocalidades);
	 						}
	 					}, function (pError) {
	 						$log.error(pError);
	 					});
 					} else {
 						vm.data.localidades = [];
 					}
 				}


 				function inicializarVariables () {
 					vm.formControl.esEdit = false;
 					vm.formControl.esNew = false;
 				}

 				/* ------------------------------ CALLE ------------------------------ */

 				function getCalles (val) {
 					return DomicilioDataService.getCalles(val)
 					.then(function (pCalles) {
 						return pCalles;
 					});
 				}

 				function getAddress(val) {
 					return DomicilioDataService.getAddress(val)
 					.then(function (pData) {
 						return pData.results.map(function(item){
 							return item.address_components[0].short_name;
 						});
 					});
 				}

 				function getBarrios (val) {
 					return DomicilioDataService.getBarrios(val)
 					.then(function (pBarrios) {
 						return pBarrios;
 					});
 				}

 				/* ------------------------------ ACTIVATE ------------------------------ */

 				activate();
 				
				function activate () {
					$log.debug('Inicializar ON.-');
					vm.formControl.loading = true;

					var _paises = DomicilioDataService.getAllPaises();
					var _tiposDomicilios = DomicilioDataService.getAllTiposDomicilios();

					inicializarVariables();

					$q.all([_paises, _tiposDomicilios])
					.then(activateOk, activateError);
				}

				function activateOk (pReponse) {
					vm.data.paises = pReponse[0];
					vm.data.tiposDomicilios = pReponse[1];
					vm.formControl.loading = false;

					angular.copy(Domicilio, vm.formData.domicilio);
					$log.debug('Domicilio que llega ', Domicilio);

					vm.formData.pais = {
						id_pais : Domicilio.IdPais,//12	
						nombre_pais	: Domicilio.PaisNombre
					};
					vm.formData.TipoDomicilio = {
						Id : Domicilio.IdTipoDomicilio,//39
						Nombre : Domicilio.TipoDomicilio//'Fiscal'
					};

					cargarProvincias(Domicilio.IdPais);

					if (Domicilio && (Domicilio.Id || Domicilio.$$hashKey)) {
						//$log.debug('Domicilio que llega ', Domicilio);
						vm.formControl.esEdit = true;
						vm.formData.domicilio.$$hashKey = Domicilio.$$hashKey;
						//angular.copy(Domicilio, vm.formData.domicilio);

					} else {
						vm.formControl.esNew = true;
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