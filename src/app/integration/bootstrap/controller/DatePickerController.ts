/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('DatePickerController', DatePickerController);

		DatePickerController.$inject = ['$scope', 'Logger'];

		function DatePickerController ($scope, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DatePickerController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			$scope.anioMax = new Date().getFullYear() + 2;
			$scope.fechaMax = '12/31/' + $scope.anioMax;
			$scope.maxDateCommon = new Date($scope.fechaMax);
			$scope.minDateCommon = new Date('01/01/1900');
			$scope.today = $scope.today ? null : new Date();
			
			$scope.toggleMin = toggleMin;
			$scope.habilitar = habilitar;
			$scope.open1 = open1;
			$scope.open2 = open2;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function habilitar () {
				return false;
			}

			function open1 ($event) {
				$log.warn('Depreco');
				$event.preventDefault();
				$event.stopPropagation();
				$scope.opened1 = true;
			}

			function open2 ($event) {
				$log.warn('Depreco');
				$event.preventDefault();
				$event.stopPropagation();
				$scope.opened2 = true;
			}

			function toggleMin (argument) {
				$log.debug('ToggleMin ON.-');
				if ($scope.dt1 == null) {
					$scope.minDateHasta = '';
					$scope.deshabilitarFechaHasta = true;
				} else {
					$scope.minDateHasta = $scope.dt1;
					if ($scope.dt2 != null) {
						if ($scope.dt2 <= $scope.dt1) {
							$scope.dt2 = '';
						}
					}
					$scope.deshabilitarFechaHasta = false;
				}
			}
		}
	};
	return module;

})();