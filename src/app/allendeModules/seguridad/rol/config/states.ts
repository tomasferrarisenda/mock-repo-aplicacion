/**
 * @author ppautasso
 * @description 
 */
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Seguridad/Rol', '/Seguridad/Rol/Gestion');


			$stateProvider.state({
				name: 'rol',
				parent: 'seguridad',
				//abstract: true,
				template: '<ui-view/>',
				url: '/Rol'
			});


		}
	};

	return module;
})();
