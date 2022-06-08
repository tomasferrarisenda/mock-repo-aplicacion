/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Profesional Solicitante
 * @type:			Directive
 **/
import profesionalTemplate = require('../templates/sa-Profesional-Solicitante-Selector.tpl.html');
import { IProfesionalesDataService } from '../../../profesionales';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saProfesionalSolicitanteSelector', saProfesionalSolicitanteSelector);

		saProfesionalSolicitanteSelector.$inject = ['$log', 'SupportLogicService', 'ModalService', 'ProfesionalesDataService'];
		function saProfesionalSolicitanteSelector ($log, SupportLogicService, ModalService, ProfesionalesDataService: IProfesionalesDataService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@',
					mostrarlabelcodigo : '@',
					mostrarlabelnombre : '@',
					tooltip : '@'
				},
				template: profesionalTemplate,
				link: link
			};

			function link(scope){
				scope.cambioMatriculaProfesional = cambioMatriculaProfesional;
				scope.busquedaRapidaProfesionalSolicitante = busquedaRapidaProfesionalSolicitante;
				scope.searchProfesionalSolicitante = searchProfesionalSolicitante;

				scope.filter = {
					matricula : null,
					nombre : ''
				};

				scope.data = {
					matricula : null,
					nombre : ''
				};

				function searchProfesionalSolicitante() {
 					SupportLogicService.searchProfesionalSolicitante()
 						.then(function (pProfesionalSeleccionado) {
 							scope.model = pProfesionalSeleccionado;
 							scope.data.matricula = scope.model.Matricula;
							updateView(pProfesionalSeleccionado);
 						});
 				}

 				function busquedaRapidaProfesionalSolicitante() {
 					if(scope.filter.matricula == null){
 						scope.model = '';
						scope.data.matricula = null;
						scope.data.nombre = null;
						scope.filter.matricula = null;
						scope.filter.nombre = null;
 					}
 					else{
	 					if (scope.filter.matricula && !scope.filter.nombre){
	 						ProfesionalesDataService.getProfesionalSolicitantePorMatricula(scope.filter.matricula)
								.then(function(solicitantes){
									if(solicitantes.length == 1) {
										scope.model = solicitantes[0];
										scope.data.matricula = solicitantes[0].Matricula;
									}else{
										if(solicitantes.length > 1){
											// ModalService.error("Verifique por favor, existe mas de un profesional con la misma matrícula. Debe buscar y seleccionar el profesional solicitante.");
											searchProfesionalSolicitante();
										}
										scope.model = '';
										scope.data.matricula = '';
										updateView(null);									
									}

									// if(pProfesionalSeleccionado){
				 					// 	scope.model = pProfesionalSeleccionado;
									// 	scope.data.matricula = pProfesionalSeleccionado.Matricula;
									// }
									// else
									// 	scope.model = '';
									// updateView(pProfesionalSeleccionado);
	 							}
	 						);
	 					}
	 				}
 				}

 				function updateView(pProfesional){
 					if(pProfesional){
	 					scope.filter.matricula = pProfesional.Matricula;
						scope.filter.nombre = pProfesional.Nombre;
					}
 				}

 				function cambioMatriculaProfesional() {
 					if(scope.data.matricula != ''  && scope.filter.matricula != scope.data.matricula){
 						scope.filter.nombre = '';
 					}
 				}

 				scope.$watch(function () {
					return scope.model;
				}, function(newValue) {
					if(newValue != null){
						scope.filter.matricula = newValue.Matricula;
						scope.filter.nombre = newValue.Nombre;
					}
				});
			}
		}
	};

	return module;

})();