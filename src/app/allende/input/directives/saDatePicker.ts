/**
 * @author:			Ezequiel Mansilla
 * @description:	Data picker component
 * @type:			Directive
 **/
import * as angular from 'angular';
import datePickerTemplate = require("../templates/sa-date-picker.tpl.html");
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function(ngModule) {

		// UTILIDADES: [DIRECTIVE] Selector de fechas. Se usa con [model]
		ngModule.directive('saDatePicker', saDatePicker);

		saDatePicker.$inject = ['$log'];

		function saDatePicker($log) {
			return {
				restrict: 'E',
				scope: {
					model: '=',
					disabled: '=?',
					required: '=?',
					maxDate: '=?',
					minDate: '=?',
					change: '&?'
				},
				template: datePickerTemplate,
				controller: saDatePickerController,
				controllerAs: 'vm',
				bindToController: true,
				link: link
			};

			function link(scope, element, attrs) {

				var name = (!angular.isUndefined(attrs.name)) ? attrs.name : '';

				if (name) {
					$('#txt_fecha').attr("name", name);
				}
			}
		}

		saDatePickerController.$inject = ['$scope', 'Logger', '$timeout' ];

		function saDatePickerController($scope, $log, $timeout) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('saDatePicker');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.dateOptions = {
				// dateDisabled: disabled,
				formatYear: 'yyyy',
				startingDay: 1
			};

			vm.toggleMin = toggleMin;
			vm.habilitar = habilitar;
			vm.open = open;
			vm.opened = false;

			vm.changeInterno = changeInterno;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function habilitar() {
				return false;
			}

			function open($event) {
				$event.preventDefault();
				$event.stopPropagation();
				vm.opened = !vm.opened;
			}

			function toggleMin(argument) {
				$log.debug('ToggleMin ON.-');
				if (vm.dt1 == null) {
					vm.minDateHasta = "";
					vm.deshabilitarFechaHasta = true;
				} else {
					vm.minDateHasta = vm.dt1;
					if (vm.dt2 != null) {
						if (vm.dt2 <= vm.dt1) {
							vm.dt2 = "";
						}
					}
					vm.deshabilitarFechaHasta = false;
				}
			}

			$scope.$watch(function() {
				return vm.minDate;
			}, function() {
				initOptions();
			});

			$scope.$watch(function() {
				return vm.maxDate;
			}, function() {
				initOptions();
			});

			function changeInterno() {
				if (vm.change){
					
					$timeout(function() {
						vm.change();
					});
				}

				
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			function initDates() {
				vm.anioMax = new Date().getFullYear() + 100;
				vm.fechaMax = '12/31/' + vm.anioMax;
				vm.maxDateCommon = new Date(vm.fechaMax);
				vm.minDateCommon = new Date('01/01/1900');
				vm.today = vm.today ? null : new Date();
			}

			function initOptions() {
				vm.dateOptions = {
					// dateDisabled: disabled,
					formatYear: 'yyyy',
					minDate: vm.minDate || vm.minDateCommon,
					maxDate: vm.maxDate || vm.maxDateCommon
				};
			}

			activate();

			function activate() {
				initDates();
				initOptions();
			}
		}
	};

	return module;
})();