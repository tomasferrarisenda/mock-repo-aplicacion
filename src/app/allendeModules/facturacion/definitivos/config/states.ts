/**
* @author: rbassi
* @description: definitivos para el financiador States
* @type: States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.definitivosList',
		url: '/DefinitivosList',
        template: '<ui-view><sa-loading></sa-loading></ui-view>',
	},
	{
		name: 'facturacion.definitivosList.list',
		url: '/List',
		template: '<sa-definitivos-list></sa-definitivos-list>',
		data : {
			idPermiso: 317
		}
	},
	{
		name: 'facturacion.definitivosList.edit',
		url: '/Edit',
		template: '<sa-definitivos-edit></sa-definitivos-edit>',
		params: {
			IdDefinitivo: 0, // valor por defecto
			NombreUsuario: '', // valor por defecto
		}
	}

]

const redirects = [
	{ from: '/Facturacion/DefinitivosList', to: '/Facturacion/DefinitivosList/List'}
]


export class definitivosStates {

	static init(ngModule: angular.IModule) {
	ngModule.config(statesConfig);
   
	statesConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
	function statesConfig($urlRouterProvider, $stateProvider) {
   
   for (let i = 0; i < redirects.length; i++) {
	   $urlRouterProvider.when(redirects[i].from, redirects[i].to);
   }
   
	for (let i = 0; i < states.length; i++) {
	$stateProvider.state(states[i]);
	}
	}
	}
   }
   