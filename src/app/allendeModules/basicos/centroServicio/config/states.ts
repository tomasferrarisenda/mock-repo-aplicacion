/**
 * @author ppautasso
 * @description states para centro de servicios
 */
export default (function () {

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/CentroServicios', '/CentroServicios/Gestion');

			$stateProvider.state({
				name: 'centroservicio',
				parent: 'basicos',
				url: '/CentroServicios',
				template: '<ui-view/>'
			});

		}
	};

	return module;

})();