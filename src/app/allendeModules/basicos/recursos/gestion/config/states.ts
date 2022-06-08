/**
 * @author 			ppautasso
 * @description 	description
 */
import recursosListTemplate = require('../views/recursos-gestion-list.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Basicos/Recursos/Gestion', '/Basicos/Recursos/Gestion/List');

			$stateProvider.state({
				name : 'recursos.gestion',
				url : '/Gestion',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});

			$stateProvider.state({
				name : 'recursos.gestion.list',
				url : '/List',
				template: recursosListTemplate,
				controller: 'RecursosGestionListController',
				controllerAs: 'vm',
				data : {
					idPermiso: 222,
					title : 'Lista de recursos'
				}
			});

			// //Agrego este state para que el modulo de editar organizaciones pase a ser una solapa
			// $stateProvider.state({
			// 	name : 'organizacion.gestion.edit',
			// 	url : '/Edit',
			// 	template: organizacionEdit,
			// 	controller: 'OrganizacionEditController',
			// 	controllerAs: 'vm',
			// 	params: {
			// 		idOrganizacion : 0
			// 	},
			// 	data : {
			// 		title : 'Editar una organizacion'
			// 	}
			// });

		}
	};

	return module;

})();