/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import saPrestacionListTemplate = require('../templates/sa-prestacion-list.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		// REUTILIZABLE: [DIRECTIVE] list de @Prestaciones disponibles. Se usa con [ng-model].

		module.directive('saPrestacionList', saPrestacionList);

		saPrestacionList.$inject = ['$log', '$filter'];

		function saPrestacionList($log, $filter) {

			return {
				restrict: 'E',
				require: '?ngModel',
				scope: {
					// model: '=',
					title: '@?',
					// loading : '=?',
					// 
					itemsPerPage: '<',

					viewEstadoIf: '=?',
					viewAccionesIf: '=?',
					viewSeleccionarIf: '=?',

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
				},
				template: saPrestacionListTemplate,
				link: link
			};

			function link(scope, element, attrs, controller) {

				scope.sinDatos = 'Sin datos';
				scope.loading = false;
				scope.tieneValor = '';
				scope.getCol = getStatusColor;
				scope.cantidadPrestaciones = controller.$modelValue.length || '';
				scope.model = controller.$modelValue || [];

				scope.changeChk = changeCheckBox;

				scope.paginacionPrestacion = {
					currentPage: 1,
					pageSize: 0,
					totalItems: 0,
					pageChanged: getPage,
					getPage: getPage
				};

				scope.filter = {
					id: '',
					clean: cleanFilters,
					prestaciones : [],
					//validar: validarFilters,
					nombrePrestacion: ''
				};

				scope.paginacionPrestacion.pageSize = angular.copy(scope.itemsPerPage);

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

				function changeCheckBox(prestacion) {
					
					$log.debug('prestacion change',prestacion);
					$log.debug('model',scope.model);
					scope.model.find(x => x.Id === prestacion.Id).status = prestacion.status;
				}

				function updateModel(model) {
					controller.$setViewValue(model);
				}

				scope.$watch(function() {
					return controller.$modelValue || controller.$viewValue || '';
				}, updateDirective, true);

				scope.$watch(function () {
					return scope.model;
				}, updateModel, true);


				function updateDirective(pValue) {
					scope.model = controller.$modelValue || controller.$viewValue || '';
					activate();
				}

				function cleanFilters() {
					scope.filter.Nombre = '';
					scope.paginacionPrestacion.pageChanged();
				}


				function getPage() {

					var begin = ((scope.paginacionPrestacion.currentPage - 1) * scope.paginacionPrestacion.pageSize);
					var end = begin + scope.paginacionPrestacion.pageSize;
					// scope.filter.validar();
					//scope.model = orderByFilter(scope.model, order.value, order.reverse);

					scope.filter.prestaciones = $filter('filter')
						(scope.model, {
							Nombre: scope.filter.nombre,
						});

					scope.paginacionPrestacion.totalItems = scope.filter.prestaciones.length;
					scope.filter.prestaciones = scope.filter.prestaciones.slice(begin, end);

				}

				function activate() {
					
					//scope.paginacionPrestacion.pageSize = 4;
					scope.paginacionPrestacion.getPage();

				}
			}
		}
	};

	return module;

})();