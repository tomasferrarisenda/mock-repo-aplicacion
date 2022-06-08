/**
 * @author 			ppautasso
 * @description 	description
 */
import prestacionGestionListTemplate = require('../views/prestacion-gestion-list.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {
			// $urlRouterProvider.when('/Roles/Gestion', '/Roles/Gestion/List');


			$urlRouterProvider.when('/Basicos/Prestaciones/Gestion', '/Basicos/Prestaciones/Gestion/List');			
			
			$stateProvider.state({
				name : 'prestaciones.gestion',
				url : '/Gestion',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});
		

			$stateProvider.state({
				name: 'prestaciones.gestion.list',
				url: '/List',
				template: prestacionGestionListTemplate,
				controller: 'PrestacionGestionListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 164,
					title: 'Gestion de las Prestaciones',
					icon: 'LIST'
				}
			});


		}
	};

	return module;

})();