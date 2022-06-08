/**
 * @author:			Ezequiel Mansilla
 * @description:	Columna individual para agregar al set
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableColumn', fwTableColumn);

		fwTableColumn.$inject = ['$log'];
		function fwTableColumn ($log) {
			return {
				restrict : 'E',
				require : '^fwTableColumnset',
				scope : {
					label : '<?',
					field : '<',
					classCol : '<?',
					classCell : '<?',
					type : '<?',
					format : '<?',
					order : '<?',
					visible : '<?'
				},
				link: function (scope, element, attrs, fwTableColumnsetController) {
					// $log.debug('fwTableColumn linked');

					fwTableColumnsetController.addColumn({
						label : scope.label,
						field : scope.field,
						classCol : scope.classCol,
						classCell : scope.classCell,
						type : scope.type,
						format : scope.format,
						order : scope.order,
						visible : scope.visible
					});
				}
			};
		}
	};

	return module;
})();