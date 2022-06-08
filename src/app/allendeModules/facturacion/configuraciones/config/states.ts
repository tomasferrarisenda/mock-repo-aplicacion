/**
 * @author 			jbasiluk
 * @description 	description
 */
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$stateProvider.state({
				name: 'facturacion.configuraciones',
				url: '/Configuraciones',
				template: '<ui-view/>',
				data: {
					module: 'CONFIGURACIONES'
				}
			});
		}
	};

	return module;
})();