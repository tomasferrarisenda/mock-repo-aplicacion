/**
 * @author ppautasso
 * @description states para administracon
 */
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states($stateProvider) {
			$stateProvider.state({
				name: 'seguridad',
				abstract: true,
				template: '<ui-view/>',
				parent : 'signed',
				url: '/Seguridad'
			});

		
		}
	};

	return module;
})();
