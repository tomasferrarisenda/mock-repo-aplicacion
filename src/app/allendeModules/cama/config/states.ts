/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider) {

			$stateProvider.state('cama',{
				abstract : true,
				url : '/Cama',
				parent : 'signed',
				template : '<ui-view><sa-loading></sa-loading></ui-view>',
				data : {
					module : 'CAMA',
					path : 'Cama/'
				}
			});
		}
	};

	return module;
})();