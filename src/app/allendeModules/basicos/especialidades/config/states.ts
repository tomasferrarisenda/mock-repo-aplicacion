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

			$urlRouterProvider.when('/Especialidades', '/Especialidades/Gestion');

			$stateProvider.state({
				name: 'especialidades',
				parent: 'basicos',
				url: '/Especialidades',
				template: '<ui-view/>'
			});


		}
	};

	return module;

})();