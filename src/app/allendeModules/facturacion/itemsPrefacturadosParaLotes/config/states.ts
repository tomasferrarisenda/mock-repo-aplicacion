/**
* @author: rbassi
* @description: states items prefacturados para lote
* @type: States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.itemsPrefacturadosParaLotes',
		url: '/ListParaLotes',
        template: '<sa-items-prefacturados-para-lote-list></sa-items-prefacturados-para-lote-list>',
	}

]

const redirects = [
//	{ from: '/Facturacion/DefinitivosList', to: '/Facturacion/DefinitivosList/List'}
]


export class itemsPrefacturadosParaLoteStates {

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
   