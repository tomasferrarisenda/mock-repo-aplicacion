/**
 * @author 			mastore
 * @description 	StockFarmacia
 */

import farmaciaTemplate = require('../views/farmacia.html');
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$stateProvider'];

		function routes($stateProvider) {
			$stateProvider.state({
				name: 'stock.farmacia',
				url: '/Farmacia',
				template: farmaciaTemplate,
				controller: 'FarmaciaController',
				controllerAs: 'vm',
				data: {
					idPermiso: 114
				}
			});
		}
	};

	return module;
})();