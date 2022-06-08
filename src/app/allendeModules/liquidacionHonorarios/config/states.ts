/**
* @author:         emansilla
* @description:    Liquidacion de honorarios
* @type:           States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'liquidacionHonorarios',
		parent: 'signed',
		url: '/LiquidacionHonorarios',
		template: '<ui-view><sa-loading></sa-loading></ui-view>',
		data: {
			module: 'LIQUIDACION HONORARIOS',
			path: 'LiquidacionHonorarios'
		}
	}
];

export class LiquidacionHonorariosStates {

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