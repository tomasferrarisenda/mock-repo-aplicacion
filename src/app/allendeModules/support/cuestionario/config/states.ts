/**
 * @author 			mastore
 * @description 	description
 */
import newTemplate = require('../views/new.html');
import realizarTemplate = require('../views/realizar.html');

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			$stateProvider.state({
				name : 'cuestionario',
				parent : 'signed',
				url : '/Cuestionario',
				template : '<ui-view/>',
				data : {
					module : 'CUESTIONARIO',
					path : '/Cuestionario'
				}
			});

			$stateProvider.state({
				name : 'cuestionario.new',
				url: '/List',
				template: newTemplate,
				controller: 'CuestionarioNewController',
				controllerAs: 'vm',
				data : {
					// idPermiso : 187,
					title : 'Nuevo Cuestionario'
				}
			});

			$stateProvider.state({
				name : 'cuestionarioExt',
				parent : 'index',
				url : '/CuestionarioParams',
				template : '<ui-view/>',
				data : {
					path : 'CuestionarioParams',
					menuIf: false
				}
			});

			$stateProvider.state({
				name : 'cuestionarioExt.params',
				url : '/Realizar/Params/{userName}/{accessToken}/{matricula}/{clavePaciente}/{tipoCuestionario}',
				template: 'redireccionando...',
				controller: 'CuestionarioRealizarExtController',
				data : {
					userRequired : false
				}
			});

			$stateProvider.state({
				name : 'cuestionario.realizar',
				url: '/Realizar',
				template: realizarTemplate,
				controller: 'CuestionarioRealizarController',
				controllerAs: 'vm',
				params : {
					clavePaciente : 0,
					tipoCuestionario : 0
				},
				data : {
					// idPermiso : 26,
					menuIf: false,
					title : 'Cuestionario'
				}
			});
		}
	};

	return module;

})();