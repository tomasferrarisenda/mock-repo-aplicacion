/**
 * @author 			ppautasso
 * @description 	description
 */

import rolesGestionListView = require('../views/roles-gestion-list.html');

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			// $urlRouterProvider.when('/Roles/Gestion', '/Roles/Gestion/List');

			$stateProvider.state({
				name: 'rol.gestion',
				url : '/Gestion',
				template: rolesGestionListView,
				controller: 'RolesGestionController',
				controllerAs: 'vm',
				data : {
					idPermiso: 127,
					title: 'Lista de todos los roles',
					icon: 'LIST'
				}
			});

		}
	};

	return module;
})();
