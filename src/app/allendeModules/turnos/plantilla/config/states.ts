/**
 * @author 			ppautasso
 * @description 	description
 */

import plantillaListView = require('../views/PlantillaList.html');
import plantillaEditView = require('../views/PlantillaEdit.html');
import duracionTurnoView = require('../views/duracion-turno-list.html');
import reglasCantidadesView = require('../views/reglas-cantidades-list.html');

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {
			// $urlRouterProvider.when('/Roles/Gestion', '/Roles/Gestion/List');


			$urlRouterProvider.when('/Turno/Plantilla', '/Turno/Plantilla/List');

			$stateProvider.state({
				name: 'turno.plantilla',
				url: '/Plantilla',
				//parent : 'facturacion',
				template: '<ui-view/>',
				data: {
					module: 'PLANTILLA'
				}
			});

			$stateProvider.state({
				name: 'turno.plantilla.listplantilla',
				url: '/List',
				template: plantillaListView,
				controller: 'PlantillaListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 253,
					title: 'Gestion de todas las Plantillas',
					icon: 'LIST'
				}
			});


			$stateProvider.state({
				name: 'turno.plantilla.editplantilla',
				url: '/Edit',
				template: plantillaEditView,				
				controller: 'PlantillaEditController',
				controllerAs: 'vm',
				params: {
					recurso : '',
					servicio: '',
					plantillaEdit: null
				},
				data: {
					title: 'Agregar/Editar Plantilla',
					icon: 'ADD'
				}

			});

			$stateProvider.state({
				name: 'turno.plantilla.duracionturno',
				url: '/DuracionTurno',
				template: duracionTurnoView,				
				controller: 'DuracionesTurnosListController',
				controllerAs: 'vm',
				params: {
					idServicio : null,
					idRecurso: null,
					idTipoRecurso: null
				},
				data: {
					idPermiso: 257,
					title: 'Agregar/Editar Duracion Turno',
					icon: 'ADD'
				}

			});

			$stateProvider.state({
				name: 'turno.plantilla.reglasdecantidades',
				url: '/ReglasDeCantidades',
				template: reglasCantidadesView,
				controller: 'ReglasDeCantidadesListController',
				controllerAs: 'vm',
				params: {
					idServicio : null,
					idRecurso: null,
					idTipoRecurso: null,
					idTipoDemanda : null
				},
				data: {
					idPermiso: 258,
					title: 'Agregar/Editar Reglas de Cantidades de Turnos',
					icon: 'ADD'
				}

			});
		


		}
	};

	return module;
})();
