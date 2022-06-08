/**
 * @author 			ppautasso
 * @description 	description
 */
import listarHomologaciones = require('../views/homologacionesList.html');
import verHomologacion = require('../views/homologacionView.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Financiadores/Homologaciones', '/Financiadores/Homologaciones/List');

			$stateProvider.state({
				name: 'financiadores.homologaciones',
				url: '/Homologaciones',
				//parent : 'financiadores',
				template: '<ui-view/>',
				data: {
					module: 'HOMOLOGACIONES'
				}
			});

			$stateProvider.state('financiadores.homologaciones.list', {
				url: '/List',
				template: listarHomologaciones,
				controller: 'HomologacionesListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 38,
					title: 'Lista de todas las homologaciones',
					icon: 'LIST'
				}
			});

			$stateProvider.state('financiadores.homologaciones.editar', {
				url: '/Edit',
				template: verHomologacion,
				controller: 'HomologacionViewController',
				controllerAs: 'vm',
				data: {
					idPermiso: 157,
					title: 'Editar Homologaciones',
					icon: 'EDIT'
				}
			});

			// UserByAction.$inject = ['HabitacionGestionAuthService', '$location'];
			// function UserByAction (CamaAuthService, $location) {
			// 	return CamaAuthService.resolveAction($location.path());
			// }
		}
	};

	return module;
})();