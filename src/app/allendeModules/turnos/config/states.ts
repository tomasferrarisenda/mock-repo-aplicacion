/**
 * @author ppautasso
 * @description states para turnos
 */
export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states($stateProvider) {
			$stateProvider.state({
				name: 'turno',
				abstract: true,
				template: '<ui-view/>',
				parent : 'signed',
				url: '/Turno'
			});

		
		}
	};

	return module;
})();