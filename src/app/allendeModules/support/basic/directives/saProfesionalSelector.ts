/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Profesional
 * @type:			Directive
 **/
import profesionalTemplate = require('../templates/sa-Profesional-Selector.tpl.html');
import { IProfesionalesDataService } from '../../../profesionales';


export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saProfesionalSelector', saProfesionalSelector);

		saProfesionalSelector.$inject = ['$log', 'SupportLogicService', 'ProfesionalesDataService'];
		function saProfesionalSelector ($log, SupportLogicService, ProfesionalesDataService: IProfesionalesDataService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@',
					mostrarlabelcodigo : '@',
					mostrarlabelnombre : '@',
					tooltip : '@',
					disabled : '<?'
				},
				template: profesionalTemplate,
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
 					SupportLogicService.searchProfesional()
 						.then(function (pProfesionalSeleccionado) {
 							scope.model = pProfesionalSeleccionado;
 							scope.data.matricula = scope.model.Matricula;
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
	 						ProfesionalesDataService.getProfesionalPorMatricula(scope.filter.matricula)
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
					else
					{
						scope.filter.matricula = null;
						scope.filter.nombre = null;
					}
				});
			}
		}
	};

	return module;

})();