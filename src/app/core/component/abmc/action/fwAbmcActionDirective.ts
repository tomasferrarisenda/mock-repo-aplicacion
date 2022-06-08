/**
 * @author:			Ezequiel Mansilla
 * @description:	AbmcAction genéricas. Para acciones que no son por defecto
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwAbmcAction', fwAbmcAction);

		fwAbmcAction.$inject = ['$log'];
		function fwAbmcAction ($log) {
			return {
				restrict : 'E',
				require: '^fwAbmcActionset',
				scope : {
					title : '<?',
					label : '<?',
					icon : '<?',
					action : '&',
					inline: '<?'
				},
				link: link
			};

			function link (scope, element, attrs, fwAbmcActionsetController) {
				$log.debug('fwAbmcAction linked');

				fwAbmcActionsetController.addAction({
					title : scope.title,
					label : scope.label,
					icon : scope.icon,
					action : scope.action,
					inline : scope.inline
				});
			}
		}
	};

	return module;
})();