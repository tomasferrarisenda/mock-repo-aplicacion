/**
 * @author 			ppautasso
 * @description 	description
 */
import camaListTemplate = require('../views/gestion-list.html');
export default (function () {

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Cama/Gestion', '/Cama/Gestion/List');

			$stateProvider.state({
				name : 'cama.gestion',
				url : '/Gestion',
				template : '<ui-view></ui-view>'
			});

			$stateProvider.state({
				name : 'cama.gestion.list',
				url : '/List',
				template: camaListTemplate,
				controller: 'HabitacionGestionListController',
				controllerAs: 'vm',
				data : {
					title: 'Lista de todas las habitaciones',
					icon: 'LIST',
					idPermiso : 18
				}
			});
		}
	};

	return module;
})();