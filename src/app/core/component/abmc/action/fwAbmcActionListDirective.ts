/**
 * @author:			Ezequiel Mansilla
 * @description:	List action
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwAbmcActionList', fwAbmcActionList);

		fwAbmcActionList.$inject = ['$log'];
		function fwAbmcActionList ($log) {
			return {
				restrict : 'E',
				require: '^fwAbmcActionset',
				scope : {
					title : '<?',
					label : '<?',
					icon : '<?',
					type : '<?',
					method : '<?',
					map : '&?'
				},
				link: link
			};

			function link (scope, element, attrs, fwAbmcActionsetController) {
				$log.debug('fwAbmcActionList linked');
				fwAbmcActionsetController.addAction({
					title : scope.title || 'Listado',
					label : scope.label || 'LISTA',
					icon : scope.icon || 'LIST',
					method : scope.method || 'get',
					action : scope.action,
					mapFunction : scope.map,
					base : true,
					inline : false
				});
			}
		}
	};

	return module;
})();