/**
 * @author:			Ezequiel Mansilla
 * @description:	Contenedor de DropDown
 * @type:			Directive
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES : [DIRECTIVE] Manejo de dropdowns con items dinamicos. Consultar example.html
		ngModule.directive('fwDropDownContainer', fwDropDownContainer);

		fwDropDownContainer.$inject = ['$log'];
		function fwDropDownContainer ($log) {
			return {
				restrict : 'E',
				scope : {
					label : '<?',
					icon : '<?',
					btnClass : '@?',
					btnContainerClass : '@?',
					change : '&?',
					required: '<?',
					// autoClose: '<?'
				},
				controller : fwDropDownContainerController,
				link: link
			};

			function link (scope, element, attrs) {
				scope.btnClass = (angular.isUndefined(scope.btnClass)) ? 'btn-info' : scope.btnClass;
				scope.required = (angular.isUndefined(scope.required)) ? false : scope.required;
				$log.debug('fwDropDownContainer linked');
			}
		}

		fwDropDownContainerController.$inject = ['Logger', '$scope',  'DropDown'];
		function fwDropDownContainerController ($log, $scope,  DropDown) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwDropDownContainerController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			var dropdown : any = {
				label : $scope.label,
				icon : $scope.icon,
				btnClass : $scope.btnClass,
				btnContainerClass : $scope.btnContainerClass,
				required: $scope.required,
				// autoClose: $scope.autoClose,
				items : []
			};

			vm.setItems = setItems;
			vm.getDropDown = getDropDown;
			vm.notifyChange = notifyChange;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function setItems(pItems) {
				dropdown.items = pItems;
			}

			function notifyChange() {
				if ($scope.change && angular.isFunction($scope.change)) {
					$scope.change();
				}
			}

			function getDropDown() {
				dropdown = DropDown.build(dropdown);
				if (!dropdown.isValid()) return;
				return dropdown;
			}
		}
	};

	return module;
})();