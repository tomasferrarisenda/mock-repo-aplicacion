/**
 * @author 			jbasiluk
 * @description 	description
 */
import codigosNomencladorList = require ('../views/codigosNomencladorList.html');
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Facturacion/Configuraciones/CodigosNomenclador', '/Facturacion/Configuraciones/CodigosNomenclador/List');

			$stateProvider.state({
				name: 'facturacion.configuraciones.codigosNomenclador',
				url: '/CodigosNomenclador',
				template: '<ui-view/>'
			});

			$stateProvider.state('facturacion.configuraciones.codigosNomenclador.list', {
				url: '/List',
				template: codigosNomencladorList,
				controller: 'CodigosNomencladorListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 210,
					title: 'Lista de codigos de nomenclador',
					icon: 'LIST'
				}
			});
		}
	};
	return module;
})();