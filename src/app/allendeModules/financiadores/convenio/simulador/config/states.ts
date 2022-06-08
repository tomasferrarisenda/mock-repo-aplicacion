/**
 * @author 			drobledo
 * @description 	Simuladores de convenio
 */
import simuladorConvenios = require('../views/simulador.html');
import listaPreciosConvenios = require('../views/simuladorListaPrecios.html');
import comparadorPreciosConvenios = require('../views/comparadorPrecios.html');
import simuladorPrefacturaAmbulatoria = require('../views/simuladorPrefacturaAmbulatoria.html');

export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$stateProvider.state('financiadores.convenios.simulador', {
				url: '/Simulacion',
				template: simuladorConvenios,
				controller: 'SimuladorController',
				controllerAs: 'vm',
				data: {
					idPermiso: 224
				}
			});

			$stateProvider.state('financiadores.convenios.simuladorListaPrecios', {
				url: '/simuladorListaPrecios',
				template: listaPreciosConvenios,
				controller: 'SimuladorListaPreciosController',
				controllerAs: 'vm',
				data: {
					idPermiso: 225
				}
			});

			$stateProvider.state('financiadores.convenios.comparador', {
				url: '/comparadorPrecios',
				template: comparadorPreciosConvenios,
				controller: 'ComparadorPreciosController',
				controllerAs: 'vm',
				data: {
					idPermiso: 226
				}
			});
			
			$stateProvider.state('financiadores.convenios.simuladorPrefacturaAmbulatoria', {
				url: '/simuladorPrefacturaAmbulatoria',
				template: simuladorPrefacturaAmbulatoria,
				controller: 'SimuladorPrefacturaAmbulatoriaController',
				controllerAs: 'vm',
				data: {
					idPermiso: 233
				}
            });
        }
	};

	return module;
})();