/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Prestaciones', '/Prestaciones/Gestion');

			$stateProvider.state({
				name: 'prestaciones',
				parent: 'basicos',
				url: '/Prestaciones',
				template: '<ui-view/>'
			});

		}
	};

	return module;

})();