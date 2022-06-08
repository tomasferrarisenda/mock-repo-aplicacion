/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Plan Mutual
 * @type:			Directive
 **/
import planMutualTemplate = require('../templates/sa-plan-mutual.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };
	module.init = function (module) {
		module.directive('saPlanMutual', saPlanMutual);
		saPlanMutual.$inject = ['$log', 'ModalService', 'MutualDataService'];
		function saPlanMutual ($log, ModalService,  MutualDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					idMutual : '=?',
					idPlanElegido : '=?',
					valorDefault : '=?',
					ngDisabled : '=?',
					planMutualElegido : '=?'
				},
				template: planMutualTemplate,
				link: link
			};

			function link(scope, attrs, element, controller){
				if (!controller) return;

				// scope.searchMutual = searchMutual;
				scope.updateModel = updateModel;

				scope.data = {
					planesMutual : ''
				};

				function searchMutual() {
					if(scope.idMutual){
						MutualDataService.ObtenerTodosPorMutual(scope.idMutual)
 						.then(function (planesMutual) {
 							scope.data.planesMutual = planesMutual;
							for (var i = scope.data.planesMutual.length - 1; i >= 0; i--) {
								if(scope.data.planesMutual[i].Id === scope.idPlanElegido){

									scope.planMutualElegido = scope.data.planesMutual[i];
									updateModel(scope.planMutualElegido);

								}
							}
 						});
					}
					else
						scope.data.planesMutual = null;
 				}

 				function updateModel(mutual) {
					controller.$setViewValue(mutual);
				}

 				scope.$watch(function () {
					return scope.idMutual;
				}, function(newValue, oldValue) {
					if(newValue !== oldValue)
						searchMutual();
				});
				


				// scope.$watch(function () {
				// 	return scope.idPlanElegido;
				// }, function (newValue, oldValue) {
				// 	if (newValue !== oldValue){

				// 		for (var i = scope.data.planesMutual.length - 1; i >= 0; i--) {
				// 			if (scope.data.planesMutual[i].Id === scope.idPlanElegido) {

				// 				scope.planMutualElegido = scope.data.planesMutual[i];
				// 				updateModel(scope.planMutualElegido);

				// 			}
				// 		}
				// 	}
				// });
			}
		}
	};

	return module;

})();