/**
* @author: rbassi
* @description: states items prefacturados pendientes
* @type: States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.itemsPrefacturadosPendientes',
		url: '/ListPendientes',
        template: '<sa-items-prefacturados-pendientes-list></sa-items-prefacturados-pendientes-list>',
	}

]

const redirects = [
//	{ from: '/Facturacion/DefinitivosList', to: '/Facturacion/DefinitivosList/List'}
]


export class itemsPrefacturadosPendientesStates {

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
   