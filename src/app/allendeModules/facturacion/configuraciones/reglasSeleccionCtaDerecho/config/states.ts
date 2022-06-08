/**
 * @author 			jbasiluk
 * @description 	States para Configuracion de Reglas Seleccion de Cta Derecho
 */
import reglasSeleccionCtaDerechoList = require ("../views/reglasSeleccionCtaDerechoList.html");
export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {


			$stateProvider.state(
			{
				name : 'facturacion.configuraciones.reglaSeleccionCuentaDerecho',
				url : 'ReglasSeleccionCtaDerecho/List',
				template: reglasSeleccionCtaDerechoList,
				controller: 'ReglasSeleccionCtaDerechoListController',
				controllerAs: 'vm',
				data : {
					idPermiso: 288
				}
			});
		}
	};

	return module;
})();