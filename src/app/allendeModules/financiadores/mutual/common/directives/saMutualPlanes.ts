import * as angular from 'angular';
import mutualPlanTemplate = require('../views/sa-mutualPlanes.html');
export default (function (){
	'use strict';
	const module = { init : (ngModule: any) => {} };
	module.init = function (module) {


		// REUTILIZABLE: [DIRECTIVE] Input para el buscardo de mutuales. Se usa con [ng-model]
		module.directive('saMutualPlanes', saMutualPlanes);

		saMutualPlanes.$inject = ['ButtonService','MutualLogicService',
										 'ModalService','MutualDataService'];
		function saMutualPlanes (ButtonService,MutualLogicService,ModalService,MutualDataService) {
			return {
				restrict : 'E',
				require : '?ngModel',
				scope : {					
					title : '@?',
					idMutual : '<',

					btnNewDisabled : '=?',
					btnNewIf : '=?',
					 
					btnEditDisabled : '=?',
					btnEditIf : '=?',
					 
					btnDeleteDisabled : '=?',
					btnDeleteIf : '=?'
				},
				template : mutualPlanTemplate,				
				link : link
			};

			function link(scope, element, attrs, controller) {				

				if (!controller) return;
				/*----------------------------------------- API Y VARIABLES -----------------------------------------*/

				scope.sinDatos = 'Sin datos';
				scope.model = [];
				
				scope.btnNewClick = crearPlanMutual;
				scope.btnEditClick = editarPlanMutual;
				scope.btnDeleteClick = borrarPlan;
				
				 ButtonService.validarButtons(scope);
				/*----------------------------------------- IMPLEMENTACION -----------------------------------------*/

				function crearPlanMutual() {
					MutualDataService.ObtenerNuevoPlanMutual(scope.idMutual).then(function(_nuevoPlan){
						MutualLogicService.openPlanMutual(_nuevoPlan)
						.then(function (pPlan) {
							scope.model.push(pPlan);
							updateModel(scope.model);
						});
					});
				}
				
				function borrarPlan(index) {
					scope.model.splice(index, 1);
					updateModel(scope.model);
				}
				
				function editarPlanMutual(plan, index) {
					MutualLogicService.openPlanMutual(angular.copy(plan)).then(function (planEditado) {
						scope.model[index] = planEditado;
						updateModel(scope.model);
					 });
				}

				function updateModel(pModel) {
					controller.$setViewValue(pModel);
				}

				function updateDirective(pModel) {
					scope.model = pModel;
				}
				/*---------------------------------------------- WATCH ----------------------------------------------*/

				scope.$watch(function() {
					return controller.$modelValue || controller.$viewValue;
				}, updateDirective, true);
				/*--------------------------------------------- ACTIVATE ---------------------------------------------*/
				
				activate();
				function activate() {}
			}
		}
	};

	return module;
})();