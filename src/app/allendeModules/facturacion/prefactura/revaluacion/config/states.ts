/**
 * @author 			ppautasso
 * @description 	states para revaluacion Home
 */
import * as angular from 'angular';

const states = [

	{
		name: 'prefacturacion.revaluacion',
		url: '/Revaluacion',
		template: '<sa-revaluacion-prefactura-list><sa-loading></sa-loading></sa-revaluacion-prefactura-list>',
		data: {
			idPermiso: 300,
			module: 'PREFACTURACION'
		}
	}
]


export class RevaluacionHomeStates {
	static init(ngModule: angular.IModule) {

		ngModule.config(statesConfig);

		statesConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
		function statesConfig($urlRouterProvider, $stateProvider) {

			for (let i = 0; i < states.length; i++) {
				$stateProvider.state(states[i]);
			}
		}
	}
}