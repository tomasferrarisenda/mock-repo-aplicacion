/**
 * @author 			mastore
 * @description 	description
 */

import ListTemplate = require('../views/list.html');
export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states($stateProvider) {

			$stateProvider.state({
				name: 'guardia.administracion',
				parent: 'guardia',
				url: '/Administracion',
				template: '<ui-view/>',
				data: {
					path: '/Administracion'
				}
			});

			$stateProvider.state({
				name: 'guardia.administracion.list',
				url: '/List',
				template: ListTemplate,
				controller: 'ListAltaController',
				controllerAs: 'vm',
				data: {
					idPermiso: 187,
					title: 'Lista de Altas'
				}
			});

		}
	};

	return module;
})();
