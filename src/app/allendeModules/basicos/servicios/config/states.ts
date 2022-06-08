/**
 * @author ppautasso
 * @description states para servicios
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider','$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.when('/ServicioMedico', '/ServicioMedico/Gestion');

			$stateProvider.state({
				name: 'serviciomedico',
				parent : 'basicos',
				url: '/ServicioMedico',
				template: '<ui-view/>'
			});

		}
	};

	return module;

})();