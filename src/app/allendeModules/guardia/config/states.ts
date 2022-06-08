/**
 * @author 			mastore
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			$stateProvider.state({
				name : 'guardia',
				parent : 'signed',
				url : '/Guardia',
				template : '<ui-view/>',
				data : {
					module : 'GUARDIA',
					path : ''
				}
			});

		}
	};

	return module;
})();