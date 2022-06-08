/**
 * @author jbasiluk
 * @description 
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider','$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Integraciones/Logs', '/Integraciones/Logs/Gestion');


			$stateProvider.state({
				name: 'integraciones.logs',
				//abstract: true,
				template: '<ui-view/>',
				url: '/Logs'
			});
		
		}
	};

	return module;
})();