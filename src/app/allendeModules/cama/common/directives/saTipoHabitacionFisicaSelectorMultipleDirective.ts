/**
 * @author:			Ezequiel Mansilla
 * @description:	Selector de tipos de habitacion fisica
 * @type:			Directive
 **/
import tipoHabitacionTemplate = require('../templates/saTipoHabitacionFisicaSelectorMultipleTemplate.html');
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saTipoHabitacionFisicaSelectorMultiple', saTipoHabitacionFisicaSelectorMultiple);

		saTipoHabitacionFisicaSelectorMultiple.$inject = ['$log', 'CamaGestionDataService'];
		function saTipoHabitacionFisicaSelectorMultiple ($log, CamaGestionDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				template: tipoHabitacionTemplate,
				link: link
			};

			function link (scope, element, attrs, ngModelController) {
				$log.debug('saTipoHabitacionFisicaSelectorMultiple linked');
				if (!ngModelController) return;

				scope.data = [];

				/* --------------------------------------------- WATCH --------------------------------------------- */

				scope.$watch(function () {
					return scope.data;
				}, updateModel, true);

				scope.$watch(function () {
					return ngModelController.$modelValue || ngModelController.$viewValue;
				}, updateDirectiva, true);

				/* ---------------------------------------- IMPLEMENTACION ---------------------------------------- */

				function updateModel(pData) {
					ngModelController.$setViewValue(pData);
				}

				function updateDirectiva(pTipos) {
					if (pTipos && pTipos.length) {
						scope.data = [];
						for (var i = 0; i < pTipos.length; i++) {
							scope.data.push(pTipos[i]);
						}
					}
				}

				/* ------------------------------------------- ACTIVATE ------------------------------------------- */

				function initData() {
					CamaGestionDataService.getAllTiposHabitacionFisica()
					.then(initDataOk);

					function initDataOk(pTipos) {
						if (pTipos && pTipos.length) {
							for (var i = 0; i < pTipos.length; i++) {
								pTipos[i].status = true;
								scope.data.push(pTipos[i]);
							}
						}
					}
				}

				initData();
			}
		}
	};

	return module;
})();