/**
 * @author 			mastore
 * @description 	HomeStock
 */

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states($stateProvider) {
			$stateProvider.state({
				name: 'stock',
				abstract: true,
				template: '<ui-view/>',
				parent: 'signed',
				url: '/Stock'
			});

		}
	};

	return module;
})();