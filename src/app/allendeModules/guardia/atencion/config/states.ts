/**
 * @author 			mastore
 * @description 	description
 */

import ListTemplate = require('../views/list.html');
import NewTemplate = require('../views/new.html');
import EditTemplate = require('../views/edit.html');
import FojaTemplate = require('../views/new-foja.html');
import UrgenciaTemplate = require('../views/pedido-urgencia.html');

 export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{

			$stateProvider.state({
				name : 'guardia.atencion',
				// parent : 'guardia',
				url : '/Atencion',
				template : '<ui-view/>',
				data : {
					path : 'Atencion'
				}
			});

			$stateProvider.state({
				name : 'guardiaAtencion',
				parent : 'index',
				url : '/GuardiaAtencion',
				template : '<ui-view/>',
				data : {
					path : 'GuardiaAtencion',
					menuIf: true
				}
			});

			$stateProvider.state({
				name : 'guardiaAtencion.list',
				url: '/List',
				template: ListTemplate,
				controller: 'GuardiaListController',
				controllerAs: 'vm',
				data : {
					// userRequired : false,
					title : 'Listado de pacientes'
				}
			});

			$stateProvider.state({
				name : 'guardiaAtencion.urgencia',
				url: '/Urgencia',
				template: UrgenciaTemplate,
				controller: 'PedidoUrgenciaController',
				controllerAs: 'vm',
				data : {
					// userRequired : false,
					title : 'Carga de Urgencia'
				}
			});

			$stateProvider.state({
				name : 'guardiaAtencion.params',
				url : '/New/Params/{userName}/{accessToken}/{matricula}/{clavePaciente}/{sucursal}',
				template: 'redireccionando...',
				controller: 'GuardiaNewInterceptorController',
				data : {
					userRequired : false
				}
			});

			$stateProvider.state({
				name : 'guardia.atencion.new',
				url: '/New',
				template: NewTemplate,
				controller: 'GuardiaNewController',
				controllerAs: 'vm',
				data : {
					idPermiso : 26,
					title : 'Carga de prescripcion'
				}
			});

			$stateProvider.state({
				name : 'guardia.atencion.foja',
				url: '/Foja',
				template: FojaTemplate,
				controller: 'NewFojaGuardiaController',
				controllerAs: 'vm',
				data : {
					idPermiso : 26,
					title : 'Carga de foja'
				}
			});

			$stateProvider.state({
				name : 'guardia.atencion.edit',
				url: '/Edit',
				template: EditTemplate,
				controller: 'GuardiaEditController',
				controllerAs: 'vm',
				data : {
					idPermiso : 28,
					title : 'Carga de medicamentos'
				}
			});


		}
	};

	return module;
})();
