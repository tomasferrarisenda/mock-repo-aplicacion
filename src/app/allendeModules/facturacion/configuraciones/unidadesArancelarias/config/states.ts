/**
* @author: emansilal
* @description: Unidades arancelarias
* @type: States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.configuraciones.unidadesArancelarias',
		url: '/UnidadesArancelarias',
		template: '<sa-unidades-arancelarias-list></sa-unidades-arancelarias-list>',
		data : {
			idPermiso: 244
		}
	}

	
];

export class FacturacionUnidadesArancelariasStates {

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