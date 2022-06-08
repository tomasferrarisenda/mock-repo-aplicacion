/**
* @author:         emansilla
* @description:    COnfiguraciones de liquidacion de honorarios
* @type:           States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'liquidacionHonorarios.configuraciones',
		url: '/Configuraciones',
		template: '<ui-view><sa-loading></sa-loading></ui-view>'
	}
];

export class LiquidacionHonorariosConfiguracionesStates {

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