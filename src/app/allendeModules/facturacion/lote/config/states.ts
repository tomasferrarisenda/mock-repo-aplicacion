/**
* @author: rbassi
* @description: states lote recepcion
* @type: States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.loteList',
		url: '/LoteList',
        template: '<ui-view><sa-loading></sa-loading></ui-view>',
	},
	{
		name: 'facturacion.loteList.list',
		url: '/List',
		template: '<sa-lote-receptar-list></sa-lote-receptar-list>',
		data : {
			idPermiso: 322
		}
	}
]

const redirects = [
	{ from: '/Facturacion/LoteList', to: '/Facturacion/LoteList/List'}
];

export class loteStates {

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