/**
 * @author 			ppautasso
 * @description 	states para farmacia Home
 */
import * as angular from 'angular';

const states = [
	{
		name: 'farmacia',
		url: '/Farmacia',
		parent: 'signed',
		template: '<ui-view><sa-loading></sa-loading></ui-view>'
	},
	{
		name: 'farmacia.stockPorPiso',
		url: '/StockPorPiso',
		template: '<sa-farmacia-stock-por-piso-contenedor><sa-loading></sa-loading></sa-farmacia-stock-por-piso-contenedor>',
		data: {
			idPermiso: 266,
			module: 'STOCK POR PISO - FARMACIA'
		}
	},
	{
		name: 'farmacia.facturacion',
		url: '/Facturacion',
		template: '<sa-farmacia-facturacion-contenedor edit-precio="false"><sa-loading></sa-loading></sa-farmacia-facturacion-contenedor>',
		data: {
			idPermiso: 277,
			module: 'FACTURACION - FARMACIA'
		}
	},
	{
		name: 'farmacia.indicacionesMedicas',
		url: '/IndicacionesMedicas',
		template: '<sa-farmacia-indicaciones-medicas><sa-loading></sa-loading></sa-farmacia-indicaciones-medicas>',
		data: {
			idPermiso: 282,
			module: 'INDICACIONES MEDICAS - FARMACIA'
		}
	}
	
]


export class FarmaciaHomeStates {
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