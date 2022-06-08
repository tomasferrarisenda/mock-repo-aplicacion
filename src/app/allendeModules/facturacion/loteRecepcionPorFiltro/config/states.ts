/**
* @author: rbassi
* @description: states lote recepcion por filtro
* @type: States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.lotesListView',
		url: '/LotesListView',
        template: '<ui-view><sa-loading></sa-loading></ui-view>',
	},
	{
		name: 'facturacion.lotesListView.list',
		url: '/ListView',
		template: '<sa-lote-receptar-por-filtro-list></sa-lote-receptar-por-filtro-list>'
	},
	{
		name: 'facturacion.lotesListView.Edit',
		url: '/ListEdit',
		template: '<sa-lote-receptar-por-filtro-edit></sa-lote-receptar-por-filtro-edit>',
		params: {
			lote : {} = {} , // valor por defecto
		}
	}
]


const redirects = [
	{ from: '/Facturacion/LotesListView', to: '/Facturacion/LotesListView/ListView'}
];

export class loteRecepcionPorFiltroStates {

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