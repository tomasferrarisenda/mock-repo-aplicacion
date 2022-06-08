/**
* @author:         emansilla
* @description:    Cuentas
* @type:           States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.configuraciones.cuentas',
		url: '/Cuentas',
		template: '<sa-facturacion-cuenta-list></sa-facturacion-cuenta-list>',
		data : {
			idPermiso: 243
		}
	}
];

export class FacturacionCuentasStates {

	static init(ngModule: angular.IModule) {
		ngModule.config(statesConfig);

		statesConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
		function statesConfig($urlRouterProvider, $stateProvider) {
			//$urlRouterProvider.when('/Home', '/Home/Sistemas');

			for (let i = 0; i < states.length; i++) {
				$stateProvider.state(states[i]);
			}
		}
	}
}