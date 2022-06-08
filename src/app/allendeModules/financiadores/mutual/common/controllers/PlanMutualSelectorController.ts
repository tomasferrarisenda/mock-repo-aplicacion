/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import { ISupportDataService } from '../../../../support/basic/services';
import { IAuthorizationService } from 'core/security';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('PlanMutualSelectorController', PlanMutualSelectorController);

		// Inyección de Dependencia
		PlanMutualSelectorController.$inject = ['Logger', '$filter', '$q', '$uibModalInstance', 'MutualDataService',
			'Module', 'Title','SupportDataService', 'DateUtils', '$scope', 'AuthorizationService'];

		// Constructor del Controller
		function PlanMutualSelectorController ($log, $filter, $q, $uibModalInstance, MutualDataService,
			 Module, Title,SupportDataService: ISupportDataService, DateUtils, $scope, AuthorizationService:IAuthorizationService) {

			/* ------------------------------------------------- LOG ------------------------------------------------- */

			$log = $log.getInstance(this.constructor.name);
			$log.debug('ON.-');

				/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;
				/*vm.icono = ICON;*/
				vm.title = {
					module: Module,
					page: Title
				};

				vm.formData = {
					planSeleccionado : null,
					numeroAfiliado : null,
					tipodeAfiliado : [],
					fechaDesde :null,
					fechaHasta :null
				};

				vm.data = {
					planes: [],
					mutuales : [],
					tiposAfiliados :[],
					showAsignableTurnos: true
				};

				vm.filter = {
					planes : [],
					nombreMutual : '',
					mutual : '',
					codigoMutual : null,
					clean : cleanFilters,
					mutualPorCodigo : '',
					desde : null,
					hasta : null
				};

				vm.formControl = {
					loading : false,
					noResult: true,
					ok: returnPlanMutual,
					cancel : cancel,
					reloadPage : activate,
					validarForm : validarForm,
					getPlanes : getPlanesByMutual,
					getMutual : getMutual,
					// getMutualSearch : getMutualSearchNombre,
					// getMutualSearchCodigo : getMutualSearchCodigo,
					search : '',
					cambioMutual : cambioMutual,
					showCheckAsignableTurnos: false
				};

				vm.paginacion = {
					currentPage : 1,
 					pageSize : 5,
 					totalItems : 0,
 					pageChanged  : getPage,
 					getPage : getPage
				};

				/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

 				/* FORMULARIO */

 				function validarForm () {
 					var _flag = false;
					 //$log.debug('validarForm: INICIO.-',vm);
 					if (vm.formData.planSeleccionado &&
 						vm.filter.mutual  && vm.filter.mutual.Id &&
 						vm.formData.planSeleccionado.IdMutual == vm.filter.mutual.Id)
 						_flag=true;

 					return _flag;
 				}

 				function cancel () {
 					$uibModalInstance.dismiss('close');
 				}

 				function returnPlanMutual (form) {
					 if (form.$valid || form.txt_numeroAfiliado.$error.pattern) {
						 if (vm.formData.planSeleccionado) {

							vm.formData.planSeleccionado.NumeroAfiliado = vm.formData.numeroAfiliado || form.txt_numeroAfiliado.$viewValue;
							vm.formData.planSeleccionado.TipodeAfiliado = vm.formData.tipodeAfiliado;
							vm.formData.planSeleccionado.FechaHasta = vm.formData.fechaHasta;
							vm.formData.planSeleccionado.FechaDesde = vm.formData.fechaDesde;

							// se agrega si la mutual es visible en turnos 
							if(vm.filter.mutual && vm.filter.mutual.Id){
								vm.formData.planSeleccionado.VisibleEnTurnos = angular.copy(vm.filter.mutual.VisibleEnTurnos);
							}

							$uibModalInstance.close(vm.formData.planSeleccionado);
						} else {
							$log.error('El plan seleccionado no está definido o es nulo.');
						}
					 }
 				}

 				/* PAGINACIÓN */

 				function cleanFilters () {
					vm.filter.nombreMutual= '';
					getPage();	
 				}

 				function validarFilters () {
 					if (vm.filter.nombreMutual == null)
 						vm.filter.nombreMutual = '';
 				}

 				function getPage (pVal?) {
					var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;
					validarFilters();
					vm.filter.planes = $filter('filter')
						(vm.data.planes,{
							// Mutual:
							// {
							// 	nombre_mutual : vm.filter.nombreMutual
							// }
						});
					vm.paginacion.totalItems = vm.filter.planes.length;
					vm.filter.planes = vm.filter.planes.slice(begin, end);
					// $log.debug('GetPage OK.-');
 				}

 				/* OTROS */

 				function inicializarVariables () {
 					vm.data.planes = [];
 				}

 				// function getPlanesByMutual () {
 				// 	if (angular.isObject(vm.filter.mutual)) {
 				// 		 $log.debug('getPlanesByMutual: entra OK.-',vm);
	 			// 		MutualDataService.getAllPlanMutualByIdMutual(vm.filter.mutual.Id)
	 			// 		.then(function (pPlanes) {
	 			// 			vm.data.planes = pPlanes;
	 			// 			getPage();
	 			// 			if (pPlanes.length == 1)
	 			// 				vm.formData.planSeleccionado = pPlanes[0];
	 			// 			else
	 			// 				vm.formData.planSeleccionado = null;
	 			// 		});
 				// 	}
 				// }

				function getPlanesByMutual () {
 					if (angular.isObject(vm.filter.mutual)) {
 						 $log.debug('getPlanesByMutual: entra OK.-',vm);
	 					MutualDataService.ObtenerTodosPorMutual(vm.filter.mutual.Id)
	 					.then(function (pPlanes) {
	 						$log.debug('planes:',pPlanes);
	 						vm.data.planes = pPlanes;
	 						getPage();
	 						if (pPlanes.length == 1)
	 							vm.formData.planSeleccionado = pPlanes[0];
	 						else
	 							vm.formData.planSeleccionado = null;
	 					});
 					}
				 }

				function cambioMutual(){
					if(vm.filter.mutual){
						vm.filter.planes = null;
						vm.formData.numeroAfiliado = null;
						vm.formData.tipodeAfiliado = null;
						delete vm.formData.fechaDesde;
						delete vm.formData.fechaHasta;
					}
				}
				 

 				function getMutual (pValor) {
 					if (isNaN(pValor)) {// si es una cadena de caracter
 						return getMutualSearchNombre(pValor);
 					} else {
 						return getMutualSearchCodigo(pValor);
 					}
 				}
 				function getMutualSearchNombre (pValor) { 
 					
					var sCadena = pValor;
					sCadena = sCadena.toUpperCase();
					var sSubCadena = sCadena.substring(0, vm.formControl.search.length);
 					if (((vm.formControl.search.toUpperCase() != sSubCadena)&& pValor.length >2) || ((vm.formControl.search == '')&& pValor.length >2))
 							{			 					
								return MutualDataService.getMutualPorNombre(pValor,true)
	 						 		.then(function (pMutuales) {
									  vm.data.mutuales = pMutuales;
 						 			vm.formControl.search = sCadena;
									  $log.debug('getMutualSearch: entra Nombre Ok.-',pMutuales);
									  if(pMutuales){
										angular.forEach(pMutuales, function (mutual) {
											mutual.showCheckAsignableTurnos = angular.copy(vm.formControl.showCheckAsignableTurnos);
										});
									  }
									  return pMutuales;
 						 			});
							}
					else if( pValor.length < 3){
						vm.data.mutuales = [];
						vm.formControl.search = '';
					}
					else
					{
						return $filter('filter')(vm.data.mutuales, 
							pValor);						
					}
 				}
				function getMutualSearchCodigo (pValor) { 
					vm.data.mutuales = [];
					return MutualDataService.getMutualPorCodigo(pValor,true)
					.then(searchOk, searchError);

				}
				function searchOk (pResults){
					//vm.data.mutuales.push(pResults[0]);
					vm.data.mutuales.push(pResults);
		 			vm.formControl.search = '';
					 $log.debug('getMutualSearch: entra Codigo Ok.-',pResults);
					 if(vm.data.mutuales && vm.data.mutuales[0]){
						 angular.forEach(vm.data.mutuales, function (mutual) {
							 mutual.showCheckAsignableTurnos = angular.copy(vm.formControl.showCheckAsignableTurnos); 
						 });
					 }
			 		return vm.data.mutuales;
				}
				function searchError(pError){
					//$uibModalInstance.dismiss(pError);
					vm.formControl.search = '';
					$log.error('Inicializar ERROR.-', pError);
					return vm.data.mutuales;
			}
			
 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();
				
				function activate () {
					$log.debug('Inicializar ON.-');
					inicializarVariables();
					//vm.formControl.loading = true;
					if(AuthorizationService.tienePermisoById(null,188)) vm.formControl.showCheckAsignableTurnos = true;
					//var _mutuales = MutualDataService.getAllMutual();
					//	// var _planes = MutualDataService.getAllPlanMutual();
					var _tiposAfiliados = SupportDataService.getAllTipoAfiliadoSinAmbos();
					$q.all([_tiposAfiliados])
					.then(activateOk, activateError);
				}

				function activateOk (pResults) {
					vm.formControl.loading = false;
					//vm.data.mutuales = pResults[0];
					// vm.data.planes = pResults[1];
					vm.data.tiposAfiliados = pResults[0];
					// getPage();
					$log.debug('Inicializar OK.-', pResults);
					vm.filter.desde =  new Date() ;
					//vm.filter.hasta =  DateUtils.parseToFe(new Date()) ;
					//return vm.data.mutuales;					
				}

				function activateError (pError) {
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}
	};

	return module;

})();