/**
 * @author jbasiluk
 * @description states para administracon
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states($stateProvider) {
			$stateProvider.state({
				name: 'integraciones',
				abstract: true,
				template: '<ui-view/>',
				parent : 'signed',
				url: '/Integraciones'
			});

		
		}
	};

	return module;
})();