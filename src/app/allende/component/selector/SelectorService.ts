/**
 * @author:			Pablo Pautasso
 * @description:	Servicio de selector generico
 * @type:			Service
 **/
import selectorTemplate = require("./sa-selector.tpl.html");
import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };
	
	module.init = function (ngModule) {

		// REUTILIZABLE: [SERVICE] service para levantar un selector en modal de acuerdo a un DataService.
		ngModule.factory('SelectorService', SelectorService);

		SelectorService.$inject = ['Logger',  '$uibModal', '$injector'];

		function SelectorService($log, $uibModal, $injector: angular.auto.IInjectorService) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SelectorService');
			$log.debug('ON.-');


			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				
				newSelector : newSelector
				
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			/**

			 *
			 * Ejemplos:
			 * 	//tabla comun	
			 * 	SelectorService.new('md',"Servicio Medico",'ServiciosGestionDataService','getAll', 'Nombre',false, null)
				.then(function (pResult) {
					$log.debug('Result',pResult);
				}, function (pError) {
					$log.error('Error',pError);
				});
				*
				*  //tabla backend
				*  
				*  vm.filtroNuevo = {};
				vm.filtroNuevo.IdTipodocumento = '';
				vm.filtroNuevo.NumeroDocumento = '';
				vm.filtroNuevo.Nombre = 'pab';
				vm.filtroNuevo.Apellido = 'per';
				vm.filtroNuevo.CurrentPage = 1;
				vm.filtroNuevo.PageSize = 10;

				SelectorService.new('lg',"Persona",'PacienteDataService','obtenerPacienteConSimilares',null,true,vm.filtroNuevo)
				.then(function (pResult) {

					$log.debug('Result',pResult);

				}, function (pError) {

					$log.error('Error',pError);
				});
				* 
				*/
			function newSelector (SelectorOptions: ISelectorOptions) {

				let _hasDataService = $injector.has(SelectorOptions.dataService);
				

				if (!SelectorOptions.objCriterio) SelectorOptions.objCriterio = false;
				if (angular.isUndefined(SelectorOptions.labelWait)) 
				SelectorOptions.labelWait = 'Aguarde unos segundos...';

				//si el DataService existe continuamos
				if ($injector.has(SelectorOptions.dataService)){
					
					let _dataService = $injector.get(SelectorOptions.dataService);
					//consultamos si tiene el metodo o prop
					if (_dataService.hasOwnProperty(SelectorOptions.method) || _dataService[SelectorOptions.method]){
						
						return $uibModal.open({
							template : selectorTemplate,
							controller : 'SelectorController',
							controllerAs : 'vm',
							size: SelectorOptions.sizeModal || 'lg',
							keyboard: true,
							resolve : {
								NombreSelector: function () {
									return SelectorOptions.nombreSelector;
								},
								DataService: function () {
									return _dataService;
								},
								Metodo: function () {
									return SelectorOptions.method;
								},
								IsTableBackend: function () {
									return SelectorOptions.isTableBackEnd;
								},
								Parametro: function () {
									return SelectorOptions.objCriterio;
								},
								LabelWait: function () {
									return SelectorOptions.labelWait;
								},
								Columnas: function () {
									return SelectorOptions.columns;
								}
							}
						}).result;
					}else $log.error('Error',"El metodo del DataService no existe");

				}else $log.error('Error',"El DataService no existe");
				
				
			}

			
		}
	};

	return module;
})();