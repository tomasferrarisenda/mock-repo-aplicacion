/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Profesional por matricula
 * @type:			Directive
 **/
import profesionalMatriculaTemplate = require('../templates/sa-Matricula-Profesional.tpl.html');
import { IProfesionalesDataService } from '../../profesionales';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saMatriculaProfesional', saMatriculaProfesional);

		saMatriculaProfesional.$inject = ['$log', 'ModalService', 'ContratableLogicService',
			'ProfesionalesDataService'];
		function saMatriculaProfesional ($log, ModalService, ContratableLogicService,
			ProfesionalesDataService: IProfesionalesDataService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@',
					mostrarlabelmatricula : '@',
					mostrarlabelnombre : '@',
					tooltip : '@'
				},
				template: profesionalMatriculaTemplate,
				link: link
			};

			function link(scope){
				scope.cambioMatriculaProfesional = cambioMatriculaProfesional;
				scope.busquedaRapidaProfesional = busquedaRapidaProfesional;
				scope.searchProfesional = searchProfesional;

				scope.filter = {
					matricula : '',
					nombre : ''
				};

				scope.data = {
					matricula : null,
					nombre : ''
				};

				function searchProfesional() {
 					ContratableLogicService.searchMatriculaProfesional()
 						.then(function (pProfesionalSeleccionado) {
 							scope.model = pProfesionalSeleccionado;
 							//scope.data.matricula = scope.model.Matricula;
							updateView(pProfesionalSeleccionado);
 						});
 				}

 				function busquedaRapidaProfesional() {
 					if(scope.filter.matricula == null){
 						scope.model = '';
						scope.data.matricula = null;
						scope.data.nombre = null;
						scope.filter.matricula = null;
						scope.filter.nombre = null;
 					}
 					else{
	 					if (scope.filter.matricula && !scope.filter.nombre){
							ProfesionalesDataService.ProfesionalObtenerPorMatricula(scope.filter.matricula)
								.then(function(pProfesionalSeleccionado){
									if(pProfesionalSeleccionado){
			 							scope.model = pProfesionalSeleccionado;
										scope.data.matricula = pProfesionalSeleccionado.Matricula;
									}
									else
										scope.model = '';
									updateView(pProfesionalSeleccionado);
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
					if(newValue){
						scope.filter.matricula = newValue.Matricula;
						scope.filter.nombre = newValue.Nombre;
					}
				});
			}
		}
	};
	return module;
})();