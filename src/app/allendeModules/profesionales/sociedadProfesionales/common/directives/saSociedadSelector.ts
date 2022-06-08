/**
 * @author:			Jorge Basiluk
 * @description:	Selector de Sociedades
 * @type:			Directive
 **/
import * as angular from 'angular';
import sociedadTemplate = require('../templates/sa-sociedad-selector.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saSociedadSelector', saSociedadSelector);

		saSociedadSelector.$inject = ['$log', 'ModalService', 'SociedadLogicService', 
		'SociedadDataService', 'SupportDataService', 'SupportLogicService'];
		function saSociedadSelector ($log, ModalService, SociedadLogicService, 
			SociedadDataService, SupportDataService, SupportLogicService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					numeroMatricula : '=?',
					ngDisabled : '=?'
				},
				template: sociedadTemplate,
				link: link
			};

			function link(scope, attrs){
				scope.cambioSociedad = cambioSociedad;
				scope.busquedaRapidaSociedad = busquedaRapidaSociedad;
				scope.searchSociedades = searchSociedades;
				scope.sociedadSeleccionada = null;


				scope.filter = {
					numeroMatricula : '',
					nombre : '',
					filtrarSociedad : {}
				};

				activate();

				function activate(){
					SociedadDataService.CrearFiltroSociedad()
					.then(function(filtroDto){
						scope.filter.filtrarSociedad = filtroDto;
					});
				}

				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.$watch(function () {
					return scope.ngDisabled;
				}, function(newValue, oldValue, scope) {
					scope.disabled = newValue;
				});

				function searchSociedades() {
					SupportDataService.entidadesBuscador = SociedadDataService.getAllSociedadParaBusqueda();
					SupportDataService.tituloBuscador = 'Seleccionar Sociedad de Profesionales';
					SupportDataService.mostrarIdBuscador = false;
					SupportDataService.mostrarCodigoBuscador = true;
					SupportDataService.mostrarNombreBuscador = true;
					SupportDataService.mostrarDescripcionBuscador = false;
					SupportDataService.tituloIdBuscador = '';
					SupportDataService.tituloCodigoBuscador = 'Matricula';
					SupportDataService.tituloNombreBuscador = 'Sociedad';
					SupportDataService.tituloDescripcionBuscador = '';
					SupportLogicService.openSelectorBase()
					.then(function(result) {
						scope.filter.numeroMatricula = result.Codigo;
						scope.filter.nombre = result.Nombre;
						scope.model = result;
					});
				}

 				function busquedaRapidaSociedad() {
 					if(!scope.filter.numeroMatricula){
 						scope.model = null;
 					}
 					else{ 						
						scope.filter.filtrarSociedad.NumeroMatricula = scope.filter.numeroMatricula;
						scope.filter.filtrarSociedad.CurrentPage = 1;
						scope.filter.filtrarSociedad.PageSize = 10;

 						SociedadDataService.ObtenerPorFiltro(scope.filter.filtrarSociedad)
							.then(function(pMutual){
								if(pMutual.Rows[0]){
		 							scope.model = pMutual.Rows[0];

									scope.filter.numeroMatricula = pMutual.Rows[0].Codigo;
									scope.filter.nombre = pMutual.Rows[0].Nombre;
								}
								else
									scope.model = null;
							}
 						);
 					}
 				}

 				function cambioSociedad() {
					if(!scope.model || scope.filter.numeroMatricula != scope.model.Codigo){
						scope.filter.nombre = '';
 					}
 				}

 				scope.$watch(function () {
					return scope.model;
				}, function(newValue) {
					scope.filter.numeroMatricula = newValue ? newValue.Codigo : '';
					scope.filter.nombre = newValue ? newValue.Nombre : '';
				});

				scope.$watch(function () {
					return scope.numeroMatricula;
				}, function() {
					scope.filter.filtrarSociedad.NumeroMatricula = scope.numeroMatricula;
					scope.filter.filtrarSociedad.CurrentPage = 1;
					scope.filter.filtrarSociedad.PageSize = 10;
					SociedadDataService.ObtenerPorFiltro(scope.filter.filtrarSociedad)
					.then(function(pSociedad){
						if(pSociedad.Rows[0]){
 							scope.model = pSociedad.Rows[0];

							scope.filter.numeroMatricula = pSociedad.Rows[0].Codigo;
							scope.filter.nombre = pSociedad.Rows[0].Nombre;
						}
						else
							scope.model = null;
					});
				});
			}
		}
	};

	return module;

})();