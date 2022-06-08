/**
 * @author ppautasso
 * @description states para servicios
 */
export default (function () {

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Recursos', '/Recursos/Gestion');

			$stateProvider.state({
				name: 'recursos',
				parent: 'basicos',
				url: '/Recursos',
				template: '<ui-view/>'
			});

		}
	};

	return module;

})();