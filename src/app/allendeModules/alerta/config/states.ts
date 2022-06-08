/**
 * @author 			mastore
 * @description 	description
 */

 import alertaListTemplate = require('../views/alerta-list.html');

 export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };
	
	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			$stateProvider.state({
				name : 'alerta',
				parent : 'signed',
				url : '/Alerta',
				template : '<ui-view/>',
				data : {
					module : 'ALERTA',
					
				}
			});

			$stateProvider.state({
				name : 'alerta.list',
				url: '/List',
				template: alertaListTemplate,
				controller: 'AlertaListController',
				controllerAs: 'vm',
				data : {
					idPermiso : 187,
					title : 'Lista de Alertas'
				}
			});
		}
	};

	return module;
 })();
