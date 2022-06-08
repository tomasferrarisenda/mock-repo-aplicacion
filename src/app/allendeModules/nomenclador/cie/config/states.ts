/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$stateProvider'];

		function routes ($stateProvider)
		{
			// $stateProvider.when(ACTION.INIT,
			// {
			// 	redirectTo: ACTION.DEFAULT
			// });
			
			// $stateProvider.when(ACTION.LIST,
			// {
			// 	template: pTemplate,
			// 	controller: 'CieListController',
			// 	controllerAs: 'vm'
			// 	// resolve: {
			// 	// 	User: function (CieAuthService) {
			// 	// 		return CieAuthService.resolveAction(ACTION.LIST);
			// 	// 	}
			// 	// }
			// });
		}
	};

	return module;
})();