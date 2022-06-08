/**
 * @author:			Jorge Basiluk
 * @description:	Selector de Paciente
 * @type:			Directive
 **/ 
import * as angular from 'angular';

import pacienteTemplate = require('../views/sa-selector-paciente.html');
import { IPacienteDataService } from '../../../persona/paciente/services';
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saSelectorPaciente', saSelectorPaciente);

		saSelectorPaciente.$inject = ['$log', '$q', 'SupportDataService', 'SupportLogicService', 'PacienteDataService'];
		function saSelectorPaciente ($log, $q, SupportDataService: ISupportDataService, SupportLogicService, PacienteDataService: IPacienteDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					loading : '=?',
					idPaciente : '=?',
					ngDisabled : '=?',
					clean : '&?'
				},
				template: pacienteTemplate,
				link: link
			};

			function link (scope, attrs, element, controller) {

				if (!controller) return;
				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					tiposDocumentos:[]
				};

				scope.filter = {
					idPaciente: '',
					nombrePaciente: '',
					numeroDocumento: '',
					tipoDocumento: ''
				};

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
				
				scope.buscarPacientes = buscarPacientes;
				scope.buscarPaciente = buscarPaciente;
				scope.buscarPacienteEnter = buscarPacienteEnter;
				scope.limpiarDatos = limpiarDatos;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function updateModel (idPaciente) {
					controller.$setViewValue(idPaciente);
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
					//$log.debug('updateDirective', controller.$modelValue);
					//$log.debug('updateDirective pValue', pValue);
					scope.filter.idPaciente = controller.$modelValue;
					if(pValue == controller.$modelValue && (scope.filter.nombrePaciente != null && scope.filter.nombrePaciente != '') ){
						if(scope.filter.idPaciente == 0 || scope.filter.idPaciente == null) {
							limpiarDatos();
						}	
						return;
					}

					if(scope.filter.idPaciente == 0 || scope.filter.idPaciente == null) {
						limpiarDatos();
					} else {
						PacienteDataService.obtenerPacientePorId(scope.filter.idPaciente)
						.then(function (result) {
							if (result == null) {
								limpiarDatos();
							}
							else {
								scope.filter.nombrePaciente = result.NombreCompleto;
								scope.filter.numeroDocumento = result.NumeroDocumento;

								for (var i = scope.data.tiposDocumentos.length - 1; i >= 0; i--) {
									if(scope.data.tiposDocumentos[i].Id == result.IdTipoDocumento) {
										scope.filter.tipoDocumento = scope.data.tiposDocumentos[i];
									}
								}
							}
						},function (pError) {
							limpiarDatos();
						});
					}
				}

				function limpiarDatos() {
					scope.filter.idPaciente = 0;
					scope.filter.nombrePaciente = '';
					scope.filter.numeroDocumento = '';
					scope.filter.tipoDocumento = null;
					updateModel(null);	
				}

				function buscarPacientes() {

					SupportDataService.filtroBusquedaPacienteTipoDoc = scope.filter.tipoDocumento;
					SupportDataService.filtroBusquedaPacienteNumeroDoc = scope.filter.numeroDocumento;

					SupportLogicService.openBuscadorPaciente(null, true, null, false)
					.then(function (result) {
						if(result != null) {
							scope.filter.idPaciente = result.Id;
							scope.filter.nombrePaciente = result.NombreCompleto;
							scope.filter.numeroDocumento = result.NumeroDocumento;	

							for (var i = scope.data.tiposDocumentos.length - 1; i >= 0; i--) {
								if(scope.data.tiposDocumentos[i].Id == result.IdTipoDocumento) {
									scope.filter.tipoDocumento = scope.data.tiposDocumentos[i];
								}
							}	
						} else {
							limpiarDatos();
						}
						updateModel(result.Id);
					},function (pError) {
						limpiarDatos();
						return;
					});	
 				}

 				function buscarPacienteEnter(keyEvent) {
				 	if (keyEvent.which === 13)
				    	buscarPaciente();
				}

 				function buscarPaciente() {
 					if(scope.filter.numeroDocumento != '') {
 						var idTipo = 0;
 						if(scope.filter.tipoDocumento != null && scope.filter.tipoDocumento != '') {
 							idTipo = scope.filter.tipoDocumento.Id;
 						}
 						
 						PacienteDataService.obtenerPacientePorDocumento(idTipo,scope.filter.numeroDocumento)
							.then(function (results) {
								//$log.debug('results: ', results);
								if(results == null || results.length == 0) {
									//limpiarDatos();
									buscarPacientes();		
								} else {

									if(results.length == 1) {
										scope.filter.idPaciente = results[0].Id;
										scope.filter.nombrePaciente = results[0].NombreCompleto;
										scope.filter.numeroDocumento = results[0].NumeroDocumento;	

										for (var i = scope.data.tiposDocumentos.length - 1; i >= 0; i--) {
											if(scope.data.tiposDocumentos[i].Id == results[0].IdTipoDocumento) {
												scope.filter.tipoDocumento = scope.data.tiposDocumentos[i];
											}
										}	
										updateModel(results[0].Id);
									} else {
										buscarPacientes();										
									} 									
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
					return scope.idPaciente;
				}, function(newValue, oldValue, scope) {
					scope.idPaciente = newValue;
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
					var _tipoDocumento = SupportDataService.obtenerTodosTipoDocumento();
					// TODO: Uso incorrecto de $q. @jbasiluk
					$q.all([_tipoDocumento]).then(activateOk, activateError);
				}

				function activateOk (results) {
					scope.data.tiposDocumentos = results[0];
				}

				function activateError (pError) {
				}
			}
		}
	};

	return module;

})();