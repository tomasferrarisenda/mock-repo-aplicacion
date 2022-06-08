/**
 * @author:			Ezequiel Mansilla
 * @description:	Buttona individual para agregar al set
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableButton', fwTableButton);

		fwTableButton.$inject = ['$log'];
		function fwTableButton ($log) {
			return {
				restrict : 'E',
				require : '^fwTableButtonset',
				scope : {
					label : '<?',
					icon : '<?',
					order : '<?',
					action : '&?',
					visible : '<?',
					visibleIf: '&?',
					type: '<?',
					idElement: '@?'
				},
				link: function (scope, element, attrs, fwTableButtonsetController) {
					// $log.debug('fwTableButton linked');

					fwTableButtonsetController.addButton({
						label : scope.label,
						icon : scope.icon,
						action : scope.action,
						order : scope.order,
						visible : scope.visible,
						visibleIf: scope.visibleIf,
						type: scope.type,
						idElement: scope.idElement
					});
				}
			};
		}
	};

	return module;
})();