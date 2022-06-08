/**
 * @author 			ppautasso
 * @description 	states para lista de turnos a reprogramar
 */
import reprogramacionTurnosView = require('../views/reprogramacion-turnos-list.html');

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {
			

			$stateProvider.state({
				name: 'turno.reprogramacion',
				url: '/ListaReprogramacion',
				template: reprogramacionTurnosView,
				controller: 'ReprogramacionTurnosListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 242,
					title: 'Lista de Turnos a Reprogramar',
					icon: 'LIST'
				},
				params : {
					tipoConsulta : '',
					id : 0,
					
				}
			});

		}
	};

	return module;
})();