/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$urlRouterProvider', '$stateProvider'];

		function routes ($urlRouterProvider, $stateProvider) {
			// $urlRouterProvider.when('/Internacion', '/Internacion/Home');
			
			$stateProvider.state({
				name : 'internacion',
				parent : 'signed',
				url : '/Internacion',
				template : '<ui-view><sa-loading></sa-loading></ui-view>',
				data : {
					module : 'INTERNACION',
					path : 'Internacion'
				}
			});
		}
	};

	return module;

})();