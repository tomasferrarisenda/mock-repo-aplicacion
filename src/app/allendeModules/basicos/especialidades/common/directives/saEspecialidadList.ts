/**
 * @author 			ppautasso
 * @description 	description
 */
import saEspecialidadListTemplate = require('../templates/sa-especialidad-list.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		// REUTILIZABLE: [DIRECTIVE] list de @EspecialidadesMedicas disponibles. Se usa con [ng-model].

		module.directive('saEspecialidadList', saEspecialidadList);

		saEspecialidadList.$inject = ['Logger', 'EspecialidadMedicaDataService'];

		function saEspecialidadList($log, EspecialidadMedicaDataService) {

			return {
				restrict: 'E',
				require: '^ngModel',
				scope: {
					// model: '=',
					title: '@?',
					// loading : '=?',
					// 
					// 
					/* Botones */

					viewEstadoIf: '=?',

					/* Botones */
					btnViewClick: '&?',
					btnViewDisabled: '=?',
					btnViewIf: '=?',

					btnEditClick: '&?',
					btnEditDisabled: '=?',
					btnEditIf: '=?',

					btnDeleteClick: '&?',
					btnDeleteDisabled: '=?',
					btnDeleteIf: '=?',

					btnAsignarClick: '&?',
					btnAsignarDisabled: '=?',
					btnAsignarIf: '=?',
					btnTooltipMsg: '@?',


					btnDesactivarClick: '&?',
					btnDesactivarDisabled: '=?',
					btnDesactivarIf: '=?'
						// btnObservacionesDisabled: '=?',

				},
				template: saEspecialidadListTemplate,
				link: link
			};

			function link(scope, element, attrs, controller) {


				//  $log = $log.getInstance('saEspecialidadList');
				//  $log.debug('Scope', scope);

				scope.sinDatos = 'Sin datos';
				scope.loading = false;
				scope.tieneValor = '';
				scope.getCol = getStatusColor;
				//scope.verEspecialidad = getEspecialidad;
				//scope.editarEspecialidad = editEspecialidad;
				//scope.borrarEspecialidad = deleteEspecialidad;

				// function getEspecialidad(especialidad) {
				// 	$log.debug('getEspecialidad OK.-', especialidad);
				// }

				// function editEspecialidad(especialidad) {
				// 	$log.debug('editarEspecialidad OK.-', especialidad);
				// }

				// function deleteEspecialidad(especialidad) {
				// 	$log.debug('deleteEspecialidad OK.-', especialidad);
				// }

				function getStatusColor(servicioStatus) {

					//$log.debug('getColorStatus OK.-', servicioStatus);
					switch (servicioStatus) {
						case true:
							return 'color-verde';
						case false:
							return 'color-rojo';
						default: 
							return '';
					}
				};



				// function updateModel (pSucursal) {
				// 	controller.$setViewValue(pSucursal);
				// }

				scope.$watch(function() {
					return controller.$modelValue;
				}, function(newValue, oldValue, scope) {
					updateDirective(newValue);
				});

				function updateDirective(pValue) {
					// if (!pValue)
					scope.model = controller.$modelValue || controller.$viewValue || '';
				}

				// activate();

				function activate() {
				}
			}
		}
	}

	return module;

})();