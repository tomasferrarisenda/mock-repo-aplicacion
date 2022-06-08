/**
 * @author:			Ezequiel Mansilla
 * @description:	Dropdown item
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwDropDownItem', fwDropDownItem);

		fwDropDownItem.$inject = ['$log'];
		function fwDropDownItem ($log) {
			return {
				restrict : 'E',
				require : '^fwDropDownSet',
				scope : {
					item : '=?',
					icon : '<?',
					labelAttribute : '@?',
					statusAttribute : '@?',
					label : '<?',
					action : '&?',
					status : '=?',
					color : '<?',
					change : '&?'
				},
				link: link
			};

			function link (scope, element, attrs, fwDropDownSetController) {
				// if (!fwDropDownSetController) return;
				$log.debug('fwDropDownItem linked');

				scope.$watch(function () {
					return scope.item;
				}, updateDropDownItem, true);

				function updateDropDownItem(pItem) {
					fwDropDownSetController.updateItem(pItem);
				}

				fwDropDownSetController.addItem({
					itemReference : scope.item,
					label : scope.label,
					icon : scope.icon,
					color : scope.color,
					action : scope.action,
					status : scope.status,
					changeFunction : scope.change,
					labelAttribute : scope.labelAttribute,
					statusAttribute : scope.statusAttribute
				});
			}
		}
	};

	return module;
})();