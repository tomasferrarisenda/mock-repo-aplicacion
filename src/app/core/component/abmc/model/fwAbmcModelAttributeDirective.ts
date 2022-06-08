/**
 * @author:			Ezequiel Mansilla
 * @description:	fwAbmcModelAttribute
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwAbmcModelAttribute', fwAbmcModelAttribute);

		fwAbmcModelAttribute.$inject = ['$log'];
		function fwAbmcModelAttribute ($log) {
			return {
				restrict : 'E',
				require: '^fwAbmcModel',
				scope : {
					label : '<?',
					field : '<',
					type : '<?',
					required : '<?'
				},
				link: link
			};

			function link (scope, element, attrs, fwAbmcModelController) {
				$log.debug('fwAbmcModelAttribute linked');

				fwAbmcModelController.addAttribute({
					label : scope.label,
					type : scope.type,
					required : scope.required,
					field : scope.field
				});
			}
		}
	};

	return module;
})();