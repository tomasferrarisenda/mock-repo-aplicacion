/**
* @author: rbassi
* @description: cierre Recepcion States
* @type: States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.cierreRecepcionList',
		url: '/CierreRecepcionList',
        template: '<ui-view><sa-loading></sa-loading></ui-view>',
	},
	{
		name: 'facturacion.cierreRecepcionList.list',
		url: '/List',
		template: '<sa-cierre-recepcion-list></sa-cierre-recepcion-list>',
		data : {
			idPermiso: 285
		}
	},
	{
		name: 'facturacion.cierreRecepcionList.edit',
		url: '/Edicion',
		template: '<sa-cierre-recepcion-edit></sa-cierre-recepcion-edit>',
		params: {
			IdCierreRecepcion: 0, // valor por defecto
			NroCierreLegacy: 0 // valor por defecto
		}
	}
]

const redirects = [
	{ from: '/Facturacion/CierreRecepcionList', to: '/Facturacion/CierreRecepcionList/List'}
]


export class cierreRecepcionStates {

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
