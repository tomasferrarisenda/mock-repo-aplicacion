/**
 * @author 			ppautasso
 * @description 	description
 */

import saRecursosListTemplate = require('../templates/sa-recursos-list.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		// REUTILIZABLE: [DIRECTIVE] list de @Recursos disponibles. Se usa con [ng-model].

		module.directive('saRecursosList', saRecursosList);

		saRecursosList.$inject = ['$log'];

		function saRecursosList($log) {

			return {
				restrict: 'E',
				require: '^ngModel',
				scope: {
					// model: '=',
					title: '@?',
					tooltipOption: '@?',
					// loading : '=?',
					// 
					// 
					/* Botones */

					viewEstadoIf: '=?',

					/* Botones */
					btnViewClick: '&?',
					btnViewDisabled: '=?',
					btnViewIf: '=?',

					btnAddClick: '&?',
					btnAddDisabled: '=?',
					btnAddIf: '=?',

					btnEditClick: '&?',
					btnEditDisabled: '=?',
					btnEditIf: '=?',

					btnDeleteClick: '&?',
					btnDeleteDisabled: '=?',
					btnDeleteIf: '=?',

					btnAsignarClick: '&?',
					btnAsignarDisabled: '=?',
					btnAsignarIf: '=?',

					btnDesactivarClick : '&?',
					btnDesactivarDisabled: '=?',
					btnDesactivarIf: '=?'

				},
				template: saRecursosListTemplate,
				link: link
			};

			function link(scope, element, attrs, controller) {

				scope.sinDatos = 'Sin datos';
				scope.loading = false;
				scope.tieneValor = '';
				scope.getCol = getStatusColor;


				function getStatusColor(servicioStatus) {

					switch (servicioStatus) {
						case true:
							return 'color-verde';
						case false:
							return 'color-rojo';
						default :
							return '';

					}
				}

				scope.$watch(function() {
					return controller.$modelValue;
				}, function(newValue, oldValue, scope) {
					updateDirective(newValue);
				});

				function updateDirective(pValue) {
					scope.model = controller.$modelValue || controller.$viewValue || '';

				}

				 //activate();

				function activate() {


				
				}
			}
		}
	};

	return module;

})();