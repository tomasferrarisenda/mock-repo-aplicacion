/**
 * @author:			Jorge Basiluk
 * @description:	Selector de Recursos
 * @type:			Directive
 **/ 
import * as angular from 'angular';

import recursoTemplate = require('../views/sa-new-selector-recurso.html');
import { IRecursoDataService, ISupportDataService } from '../services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saNewSelectorRecurso', saNewSelectorRecurso);

		saNewSelectorRecurso.$inject = ['$log', '$q', 'SupportDataService', 'SupportLogicService',
			'RecursoDataService'];
		function saNewSelectorRecurso ($log, $q, SupportDataService: ISupportDataService, SupportLogicService,
			RecursoDataService: IRecursoDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					loading : '=?',
                    recurso : '=?',
					ngDisabled : '=?',
					clean : '&?'
				},
				template: recursoTemplate,
				link: link
			};

			function link (scope, attrs, element, controller) {

				if (!controller) return;
				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					tiposRecursos:[]
				};

				scope.filter = {
					idRecurso: '',
					nombreRecurso: '',
					numeroMatricula: '',
					tipoRecurso: ''
				};

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
				
				scope.buscarRecursos = buscarRecursos;
				scope.buscarRecurso = buscarRecurso;
				scope.buscarRecursoEnter = buscarRecursoEnter;
				scope.limpiarDatos = limpiarDatos;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function updateModel (recurso) {
					controller.$setViewValue(recurso);
                }
                
				scope.$watch('loading', function(newValue) {
					updateDirective(newValue);
				});

				scope.$watch(function () {
					return controller.$modelValue;
				}, function(newValue) {
					updateDirective(newValue);
				});

				function updateDirective (pValue) {
					if(controller.$modelValue != null){
						scope.filter.idRecurso = controller.$modelValue.Id;
					} else {
						scope.filter.idRecurso = 0;
					}
					
					if(pValue == controller.$modelValue && (
						scope.filter.nombreRecurso != null && scope.filter.nombreRecurso != '') )
						return;					
					if(scope.filter.idRecurso == 0 || scope.filter.idRecurso == null) {
						limpiarDatos();
					} else {
                        var idTipo = 0;
                        if(scope.filter.tipoRecurso != null && scope.filter.tipoRecurso != '') {
                            idTipo = scope.filter.tipoRecurso.Id;
                        }

						RecursoDataService.obtenerRecursoPorId(idTipo, scope.filter.idRecurso)
						.then(function (result) {
							if (result == null) {
								limpiarDatos();
							}
							else {
								scope.filter.nombreRecurso = result.Nombre;
								scope.filter.numeroMatricula = result.NumeroMatricula;

								for (var i = scope.data.tiposRecursos.length - 1; i >= 0; i--) {
									if(scope.data.tiposRecursos[i].Id == result.IdTipoRecurso) {
                                        scope.filter.tipoRecurso = scope.data.tiposRecursos[i];
									}
								}

								updateModel(result);
							}
						},function (pError) {
							limpiarDatos();
						});
					}
				}

				function limpiarDatos() {
					scope.filter.idRecurso = 0;
					scope.filter.nombreRecurso = '';
					scope.filter.numeroMatricula = '';
					scope.filter.tipoRecurso = null;
					updateModel(null);	
				}
 
                function buscarRecursos(){		
					SupportDataService.entidadesBuscador = RecursoDataService.getAllRecursos();
					SupportDataService.tituloBuscador = 'Seleccionar Recurso';
					SupportDataService.mostrarIdBuscador = false;
					SupportDataService.mostrarCodigoBuscador = true;
					SupportDataService.mostrarNombreBuscador = true;
					SupportDataService.mostrarDescripcionBuscador = true;
					SupportDataService.tituloIdBuscador = '';
					SupportDataService.tituloCodigoBuscador = 'Matricula'; 
					SupportDataService.tituloNombreBuscador = 'Nombre';
					SupportDataService.tituloDescripcionBuscador = 'Tipo';
					SupportLogicService.openSelectorBase()
						.then(function (result) {
							scope.filter.idRecurso = result.Id;
							scope.filter.nombreRecurso = result.Nombre;
                            scope.filter.numeroMatricula = result.NumeroMatricula;	
                            
                            for (var i = scope.data.tiposRecursos.length - 1; i >= 0; i--) {
                                if(scope.data.tiposRecursos[i].Id == result.IdTipoRecurso) {
                                    scope.filter.tipoRecurso = scope.data.tiposRecursos[i];
                                }
							}
							
							updateModel(result);
						})
						.catch(function (pError) {
							limpiarDatos();
							return;
						});	
				};

 				function buscarRecursoEnter(keyEvent) {
				 	if (keyEvent.which === 13)
				    	buscarRecurso();
				}

 				function buscarRecurso() {
 					if(scope.filter.numeroMatricula != '') {
 						var idTipo = 0;
 						if(scope.filter.tipoRecurso != null && scope.filter.tipoRecurso != '') {
 							idTipo = scope.filter.tipoRecurso.Id;
 						}
 						
 						RecursoDataService.obtenerRecursoPorMatricula(idTipo, scope.filter.numeroMatricula)
							.then(function (result) {
								if(result == null) {
									buscarRecursos();		
								} else {
									scope.filter.idRecurso = result.Id;
                                    scope.filter.nombreRecurso = result.Nombre;
                                    scope.filter.numeroMatricula = result.NumeroMatricula;	

                                    for (var i = scope.data.tiposRecursos.length - 1; i >= 0; i--) {
                                        if(scope.data.tiposRecursos[i].Id == result.IdTipoRecurso) {
                                            scope.filter.tipoRecurso = scope.data.tiposRecursos[i];
                                        }
                                    }	
                                    updateModel(result);									
								}	
							},function (pError) {
								limpiarDatos();
								return;
							}
						);							
 					} 
 					else {
 						limpiarDatos();
 					}
 				}

 				function limpiar() {

 				}

 				scope.$watch(function () {
					return scope.ngDisabled;
				}, function(newValue, oldValue, scope) {
					scope.disabled = newValue;
				});

				scope.$watch(function () {
					return scope.recurso;
				}, function(newValue, oldValue, scope) {
					scope.recurso = newValue;
					if(!newValue)
						limpiarDatos();
                });
                
 				scope.$watch(function () {
 					return scope.limpiar;
 				}, function(newValue, oldValue) {
 					if (newValue)
 					{
 						activate();
 						scope.limpiar = false;
 					}
 				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				
				activate();

				function activate () {
					RecursoDataService.obtenerTodosTipoRecurso()
					.then(activateOk, activateError);
				}

				function activateOk (results) {
					scope.data.tiposRecursos = results;
				}

				function activateError (pError) {
				}
			}
		}
	};

	return module;

})();