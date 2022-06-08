/**
 * @author ppautasso
 * @description states para basicos
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states($stateProvider) {
			$stateProvider.state({
				name: 'basicos',
				abstract: true,
				template: '<ui-view/>',
				parent : 'signed',
				url: '/Basicos',
				data: {
					module: 'BÁSICOS'
				}
			});
					
		}
	};

	return module;

})();