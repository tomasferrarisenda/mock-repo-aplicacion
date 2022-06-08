/**
 * @author 			drobledo
 * @description 	States para Configuracion de Cuentas por Defecto para Derechos
 */
import cuentasDefectoDerechosList = require ("../views/cuentasDefectoDerechosList.html");
export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			//$urlRouterProvider.when('/Facturacion/Configuraciones/cuentasDefectoDerechos', '/Facturacion/Configuraciones/cuentasDefectoDerechos/List');

			$stateProvider.state(
			{
				name : 'facturacion.configuraciones.cuentasDefectoDerechos',
				url : 'CuentasDefectoDerechos/List',
				template: cuentasDefectoDerechosList,
				controller: 'CuentasDefectoDerechosListController',
				controllerAs: 'vm',
				data : {
					idPermiso: 231
				}
			});
		}
	};

	return module;
})();