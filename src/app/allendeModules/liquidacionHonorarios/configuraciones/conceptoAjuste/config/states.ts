/**
* @author:         emansilla
* @description:    Concepto ajuste
* @type:           States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'liquidacionHonorarios.configuraciones.conceptosAjuste',
		url: '/ConceptosAjuste',
		template: '<sa-concepto-ajuste-list></sa-concepto-ajuste-list>',
		data : {
			idPermiso: 245
		}
	}
];

export class ConceptoAjusteStates {

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