/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Contratables
 * @type:			Directive
 **/
import * as angular from 'angular';
import contratableTemplate = require('../templates/sa-Contratables-Selector.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saContratableSelector', saContratableSelector);

		saContratableSelector.$inject = ['$log', 'ModalService', 'ContratableLogicService', 'ContratableDataService', '$q'];
		function saContratableSelector ($log, ModalService, ContratableLogicService, ContratableDataService, $q) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					matriculaContratableEdit : '=?',
					idTipoContratableEdit : '=?',
					ngDisabled : '=?'
				},
				template: contratableTemplate,
				link: link
			};

			function link(scope, attrs){
				scope.cambioMatriculaContratable = cambioMatriculaContratable;
				scope.busquedaRapidaContratable = busquedaRapidaContratable;
				scope.searchContratable = searchContratable;
				scope.cambioTipoContratable  = cambioTipoContratable;

				scope.filter = {
					matricula : null,
					nombre : '',
					tipoContratableElegido : ''
				};

				scope.data = {
					matricula : null,
					nombre : '',
					tiposContratable : '',
					filtroContratables : ''
				};

				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.$watch(function () {
					return scope.ngDisabled;
				}, function(newValue, oldValue, scope) {
					scope.disabled = newValue;
				});

				function searchContratable() {
					ContratableLogicService.searchContratable()
					.then(function (contratableSeleccionado) {
						updateModel(contratableSeleccionado)
						// scope.model = contratableSeleccionado;
						// scope.data.Contratables = scope.model.Matricula;
						for (var i = scope.data.tiposContratable.length - 1; i >= 0; i--) {
							if(scope.data.tiposContratable[i].Id == scope.model.IdTipo){
								scope.filter.tipoContratableElegido = scope.data.tiposContratable[i].Id;
								break;
							}
						}
					});
 				}

 				function busquedaRapidaContratable() {
 					if(!scope.filter.matricula){
						limpiarModelo();
 					}
 					else{
	 					if (scope.filter.matricula && !scope.filter.nombre){
							scope.filter.filtroContratables.IdTipo = scope.filter.tipoContratableElegido ? scope.filter.tipoContratableElegido : 1;
							scope.filter.filtroContratables.Matricula = scope.filter.matricula ? scope.filter.matricula : 0;

							cargarContratableConFiltros();
	 					}
 					}
				}
				 
				function updateModel(pModel) {
					if (pModel) {
						scope.model = pModel;
						scope.data.matricula = pModel.Matricula;
					} else {
						limpiarModelo();
					}
				}

				
				function cambioMatriculaContratable() {
					if(scope.data.matricula != ''  && scope.filter.matricula != scope.data.matricula){
						scope.filter.nombre = '';
					}
				}
				
				function cambioTipoContratable() {
					scope.filter.matricula = null;
					scope.filter.nombre = '';
					scope.data.matricula = null;
					scope.data.nombre = '';
					limpiarModelo();
				}
				
				function limpiarModelo(){
					scope.model.Id = 0;
					scope.model.Nombre = "";
					scope.model.NumeroMatricula = null;
					scope.model.TipoEntidadContratoInterno = "";
					scope.model.IdTipoEntidadContratoInterno = scope.filter.tipoContratableElegido;
				}
				
				scope.$watch(function () {
					return scope.model;
				}, updateView, true);

				function updateView(contratable){
					if(contratable){
					   scope.filter.tipoContratableElegido = contratable.IdTipoEntidadContratoInterno;
						scope.filter.matricula = contratable.NumeroMatricula;
					   scope.filter.nombre = contratable.Nombre;
				   }
				}
				
				scope.$watch(function () {
					return scope.matriculaContratableEdit;
				}, cambioMatriculaContratebleEdit);
				
				function cambioMatriculaContratebleEdit(matricula) {
					if(matricula){
						scope.filter.filtroContratables = scope.filter.filtroContratables ? scope.filter.filtroContratables : {};
						scope.filter.filtroContratables.Matricula = matricula;
						scope.filter.filtroContratables.IdTipo = scope.idTipoContratableEdit;
						scope.filter.filtroContratables.CurrentPage = 1;
						scope.filter.filtroContratables.PageSize = 10;
						cargarContratableConFiltros();
					}

				}

				function cargarContratableConFiltros() {
					ContratableDataService.ObtenerPorFiltro(scope.filter.filtroContratables)
					.then(function(contratable){
						updateModel(contratable[0]);
					});
				}

				/*-----------------------------------ACTIVATE----------------------------*/
				activate()
				function activate(){
					// Siempre
					cargarComboTipos();
					// Solo en nuevo
					if (!scope.matriculaContratableEdit) {
						obtenerFiltro();
						obtenerContratableNuevo();
					}
				}

				function obtenerFiltro(){
					ContratableDataService.CrearFiltroBusqueda().then(function(filtroContratables){
						scope.filter.filtroContratables = filtroContratables;
					})
				}

				function obtenerContratableNuevo(){
					ContratableDataService.ObtenerNuevo().then(function(contratableDto){
						scope.model = contratableDto;
						scope.model.IdTipoEntidadContratoInterno = 1; // Hardcode porque me chupa un hueso esta directiva....
					})
				}

				function cargarComboTipos (){
					ContratableDataService.ObtenerTodos().then(function (tiposContratables) {
						scope.data.tiposContratable = tiposContratables;
						if(scope.idTipoContratableEdit) scope.filter.tipoContratableElegido = scope.idTipoContratableEdit;
					});
				}
			}
		}
	};
	return module;

})();