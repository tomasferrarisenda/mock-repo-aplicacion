/**
 * @author 			ppautasso
 * @description 	description
 */

import feriadosListView = require('../views/FeriadosList.html');
import feriadoEditView = require('../views/FeriadoEdit.html');
import recesosListView = require('../views/RecesosList.html');
import recesoEditView = require('../views/RecesoEdit.html');

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {
			// $urlRouterProvider.when('/Roles/Gestion', '/Roles/Gestion/List');


			//$urlRouterProvider.when('/Basico/Servicio/Gestion', '/Basico/Servicio/Gestion/List');

			$stateProvider.state({
				name: 'turno.mantenimientoagenda',
				url: '/MantenimientoAgenda',
				//parent : 'facturacion',
				template: '<ui-view/>',
				data: {
					module: 'MANTENIMIENTO AGENDA'
				}
			});

			$stateProvider.state({
				name: 'turno.mantenimientoagenda.listferiados',
				url: '/Feriados/List',
				template: feriadosListView,
				controller: 'FeriadosListController',
				controllerAs: 'vm',
				data: {
					module: 'MANTENIMIENTO AGENDA - FERIADOS',
					idPermiso: 171,
					title: 'Gestion de los feriados',
					icon: 'LIST'
				}
			});


			$stateProvider.state({
				name: 'turno.mantenimientoagenda.editferiados',
				url: '/Feriados/Edit',
				template: feriadoEditView,				
				controller: 'FeriadoEditController',
				controllerAs: 'vm',
				params: {
					idFeriado : 0
				},
				data: {
					module: 'MANTENIMIENTO AGENDA - EDITAR FERIADO',
					title: 'Agregar/Editar Feriado',
					icon: 'ADD'
				}

			});

			$stateProvider.state({
				name: 'turno.mantenimientoagenda.listrecesos',
				url: '/Recesos/List',
				template: recesosListView,				
				controller: 'RecesosListController',
				controllerAs: 'vm',
				data: {
					module: 'MANTENIMIENTO AGENDA - RECESOS',
					idPermiso: 172,
					title: 'List All',
					icon: 'LIST'
				}
			});

			$stateProvider.state({
				name: 'turno.mantenimientoagenda.editrecesoindividual',
				url: '/Recesos/EditRecesoIndividual',
				template: '<sa-receso-individual-container></sa-receso-individual-container>',
				controllerAs: 'vm',
				params: {
					edit : 0,
					servicio : 0,
					recurso : 0,
					fechaDesde: 0,
					fechaHasta: 0
				},
				data: {
					module: 'MANTENIMIENTO AGENDA - EDITAR RECESO INDIVIDUAL'
				}
			});

			$stateProvider.state({
				name: 'turno.mantenimientoagenda.editrecesos',
				url: '/Recesos/Edit',
				template: recesoEditView,				
				controller: 'RecesoEditController',
				controllerAs: 'vm',
				params: {
					idReceso : 0,
					servicio : 0,
					recurso : 0
				},
				data: {
					module: 'MANTENIMIENTO AGENDA - EDITAR RECESO',
					title: 'Agregar/Editar Receso',
					icon: 'ADD'
				}
			});

			$stateProvider.state({
				name: 'turno.mantenimientoagenda.duracionPrestacion',
				url: '/DuracionPrestacion',
				template: '<sa-consulta-duracion-prestacion></sa-consulta-duracion-prestacion>',
				controllerAs: 'vm',
				data: {
					module: 'MANTENIMIENTO AGENDA - DURACION PRESTACION',
					title: 'Consulta duracion de prestación',
					icon: 'LIST'
				}
			});

		}
	};

	return module;
})();
