/**
 * @author 			mastore
 * @description 	StockEnfermeria
 */

import enfermeriaTemplate = require('../views/enfermeria.html');

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$stateProvider'];

		function routes ($stateProvider)
		{
			$stateProvider.state({
				name : 'stock.enfermeria',
				url: '/Enfermeria',
				template: enfermeriaTemplate,
				controller: 'EnfermeriaController',
				controllerAs: 'vm',
				data: {
					idPermiso: 121
				}
			});
		}
	};

	return module;
	
})();
