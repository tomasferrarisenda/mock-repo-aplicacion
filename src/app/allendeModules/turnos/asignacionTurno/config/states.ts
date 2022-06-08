/**
 * @author 			ppautasso
 * @description 	description
 */

import asignacionTurnosListView = require('../views/asignacion-turnos-list.html');
import asignacionTurnosMultiplesView = require('../views/asignacion-turnos-multiples.html');


export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {



			$urlRouterProvider.when('/Turno/AsignacionTurno', '/Turno/AsignacionTurno/List');

			$stateProvider.state({
				name: 'main.signed.asignacionturno',
				url: '/Turno/AsignacionTurno',
				template: '<ui-view/>',
				data: {
					module: 'ASIGNACION DE TURNOS'
				}
			});


			$stateProvider.state({
				name: 'main.signed.asignacionturno.list',
				url: '/List',
				template: asignacionTurnosListView,
				controller: 'AsignacionTurnoListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 188,
					title: 'Busqueda y Lista de turnos',
					icon: 'LIST'
				},
				params: {
					idTurnoToSearch: 0,
					obj : {}
				}
			});

			$stateProvider.state({
				name: 'main.signed.asignacionturno.multiples',
				url: '/Multiples',
				template: asignacionTurnosMultiplesView,
				controller: 'AsignacionTurnoMultiplesController',
				controllerAs: 'vm',
				data: {
					module: 'ASIGNACION TURNOS - VARIOS PACIENTES/RECURSOS',
					title: 'Asignacion Turnos Multiples',
					icon: 'LIST'
				},
				params : {
					pacienteObj : ''
				}
			});



		}
	};

	return module;
})();
