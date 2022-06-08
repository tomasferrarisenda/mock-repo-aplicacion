/**
 * @author 			ppautasso
 * @description 	states para lista de turnos
 */

import turnosListView = require('../views/turnos-list.html');

export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {
			

			$stateProvider.state({
				name: 'turno.listaturnos',
				url: '/ListaTurnos',
				template: turnosListView,
				controller: 'TurnosListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 208,
					title: 'Lista de todos los Turnos',
					icon: 'LIST'
				}
			});

		}
	};

	return module;
})();