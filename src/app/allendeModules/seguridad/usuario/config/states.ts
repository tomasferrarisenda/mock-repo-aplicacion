/**
 * @author ppautasso
 * @description 
 */
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider','$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Seguridad/Usuario', '/Seguridad/Usuario/Gestion/List');

			$stateProvider.state({
				name: 'usuario',
				parent: 'seguridad',
				//abstract: true,
				template: '<ui-view/>',
				url: '/Usuario'
			});

		
		}
	};

	return module;
})();