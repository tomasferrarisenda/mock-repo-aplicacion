/**
 * @author 			ppautasso
 * @description 	description
 */
import servicioListTemplate = require('../views/servicios-gestion-list.html');
import servicioContentTemplate = require('../views/servicioContentView.html');

export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Basicos/ServicioMedico/Gestion', '/Basicos/ServicioMedico/Gestion/List');

			$stateProvider.state({
				name: 'serviciomedico.gestion',
				url: '/Gestion',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});

			$stateProvider.state({
				name: 'serviciomedico.gestion.list',
				url: '/List',
				template: servicioListTemplate,
				controller: 'ServiciosGestionListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 158,
					title: 'Gestion de todos los Servicios',
					icon: 'LIST'
				}
			});


		}
	};

	return module;

})();