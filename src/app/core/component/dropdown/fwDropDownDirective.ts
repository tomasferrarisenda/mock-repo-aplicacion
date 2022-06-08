/**
 * @author:			Ezequiel Mansilla
 * @description:	Render DropDown
 * @type:			Directive
 **/
import fwDropDownTemplate = require("./fwDropDownTemplate.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwDropDown', fwDropDown);

		fwDropDown.$inject = ['$log'];
		function fwDropDown ($log) {
			return {
				restrict : 'E',
				require : '^fwDropDownContainer',
				template : fwDropDownTemplate,
				link: link
			};

			function link (scope, element, attrs, fwDropDownContainerController) {
				$log.debug('fwDropDown linked');

				scope.changeStatus = changeStatus;

				function changeStatus(pItem) {
					pItem.changeStatus();
					fwDropDownContainerController.notifyChange();
					// scope.$emit('fw-drop-down-item-changed', 'hola');
				}

				activate();

				function activate() {
					scope.dropdown = fwDropDownContainerController.getDropDown();
				}
			}
		}
	};

	return module;
})();