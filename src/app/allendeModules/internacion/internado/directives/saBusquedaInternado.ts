/**
 * @author:			Martin Astore
 * @description:	Busqueda Rapida Internado
 * @type:			Directive
 **/ 
import * as angular from 'angular';
import busquedaTemplate = require('../templates/sa-busqueda-internado.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		// REUTILIZABLE: [DIRECTIVE] Buscador de internados. Se usa con [ng-model]
		module.directive('saBusquedaInternado', saBusquedaInternado);

		saBusquedaInternado.$inject = ['$log', '$filter', 'AdmisionDataService', 'InternadoLogicService'];
		function saBusquedaInternado ($log, $filter, AdmisionDataService, InternadoLogicService) {

			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					title : '@?',
					loading : '=?',
					nombreIf : '=?',
					documentoIf : '=?',
					fechaIngresoIf : '=?',
					fechaAltaIf : '=?',
					mutualIf : '=?',
					ngDisabled : '=?',
					clean : '&?'
				},
				template: busquedaTemplate,
				link: link
			};

			function link (scope, attrs, element, controller) {

				if (!controller) return;

				$log.debug('saBusquedaInternado fechaAlta',scope.fechaAltaIf);
				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					pInternadoSeleccionado: ''
				};

				scope.filter = {
					NumeroInternado: ''
				};

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
				scope.nombreIf = (angular.isUndefined(scope.nombreIf)) ? false : scope.nombreIf;
				scope.documentoIf = (angular.isUndefined(scope.documentoIf)) ? false : scope.documentoIf;
				scope.fechaIngresoIf = (angular.isUndefined(scope.fechaIngresoIf)) ? false : scope.fechaIngresoIf;
				scope.fechaAltaIf = (angular.isUndefined(scope.fechaAltaIf)) ? false : scope.fechaAltaIf;
				scope.mutualIf = (angular.isUndefined(scope.mutualIf)) ? false : scope.mutualIf;
				// scope.selectChanged = updateModel;

				scope.searchInternados = searchInternados;
				scope.busquedaRapidaInternado = busquedaRapidaInternado;
				// scope.limpiarDataInternado = limpiarDataInternado;
				scope.actualizarFiltroInternado = actualizarFiltroInternado;
				scope.cambioNumeroInternado = cambioNumeroInternado;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */


				function updateModel (pInternado) {
					controller.$setViewValue(pInternado);
				}

				scope.$watch('loading', function(newValue) {
					updateDirective(newValue);
				});

				scope.$watch(function () {
					return controller.$modelValue;
				}, function(newValue) {
					$log.debug('entra watch', newValue);
					updateDirective(newValue);
				});

				function updateDirective (pValue) {
					if (pValue)
					{
						if(pValue.NumeroInternado != '' && scope.filter.NumeroInternado != pValue.NumeroInternado){
							limpiarDataInternado();
							scope.filter.NumeroInternado = pValue.NumeroInternado;
	 						busquedaRapidaInternado();
	 					}
					}
 					if(pValue == '' || pValue == undefined)
 					{
 						scope.filter.NumeroInternado = '';
 						limpiarDataInternado();
 					}
				}
				
				function searchInternados() {
 					InternadoLogicService.searchInternados()
 						.then(function (pInternadoSeleccionado) {
 							scope.data.pInternadoSeleccionado =  pInternadoSeleccionado;
 							scope.filter.NumeroInternado = scope.data.pInternadoSeleccionado.NumeroInternado;
							actualizarFiltroInternado();
						});
 				}

 				function busquedaRapidaInternado() {
 					if (scope.filter.NumeroInternado && scope.filter.NumeroInternado != null && 
 							scope.filter.nombreInternado == ''){
 						AdmisionDataService.getOneInternacionByNumero(scope.filter.NumeroInternado)
							.then(function(pInternadoSeleccionado){
								scope.data.pInternadoSeleccionado = pInternadoSeleccionado;
								scope.filter.NumeroInternado = scope.data.pInternadoSeleccionado.NumeroInternado;
								actualizarFiltroInternado();
 							});
 					}
 				}

 				function limpiarDataInternado (){
					scope.filter.nombreInternado = '';
					scope.filter.tipoNumeroDocumento = '';
					scope.filter.obraPlanPredefinidos = '';
					scope.filter.fechaIngreso = '';
					scope.filter.fechaAlta = '';
					scope.filter.fechaRealizacion = '';
					scope.filter.coberturaCabeceraElegida = {};
					// controller.$modelValue = null;
					scope.clean();
 				}

				function actualizarFiltroInternado() {
					scope.filter.nombreInternado = scope.data.pInternadoSeleccionado.NombreInternado;
					scope.filter.tipoNumeroDocumento = 
							scope.data.pInternadoSeleccionado.TipoDocumento +
							': ' +
							scope.data.pInternadoSeleccionado.NumeroDocumento;

					//scope.filter.obraPlanPredefinidos = scope.data.pInternadoSeleccionado.Mutual.nombre_mutual;
					scope.filter.fechaIngreso = $filter('date')
						(scope.data.pInternadoSeleccionado.FechaAdmision, 'dd/MM/yyyy');
					scope.filter.fechaRealizacion = $filter('date')
						(scope.data.pInternadoSeleccionado.FechaAdmision, 'dd/MM/yyyy');
					scope.filter.fechaAlta = $filter('date')
						(scope.data.pInternadoSeleccionado.FechaAltaMedica, 'dd/MM/yyyy');
					updateModel(scope.data.pInternadoSeleccionado);

 				}

 				function cambioNumeroInternado() {
 					// $log.debug('Cambio numero internado. Model:', controller.$modelValue);
 					if(scope.data.pInternadoSeleccionado.NumeroInternado != '' && 
 							scope.filter.NumeroInternado != scope.data.pInternadoSeleccionado.NumeroInternado){
 						limpiarDataInternado();
 					}
 				}

 				// function limpiar() {

 				// }

 				// scope.$watch(function () {
 				// 	return scope.limpiar;
 				// }, function(newValue, oldValue) {
 				// 	if (newValue)
 				// 	{
 				// 		activate();
 				// 		scope.limpiar = false;
 				// 	}
 				// });



				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				
				// activate();

				// function activate () {
				// 	$log.debug('saBusquedaInternado ON');
				// }
			}
		}
	};

	return module;

})();