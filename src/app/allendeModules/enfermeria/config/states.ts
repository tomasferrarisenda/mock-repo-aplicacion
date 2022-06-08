/**
 * @author 			ppautasso
 * @description 	states para enfermeria Home
 */
import * as angular from 'angular';

const states = [
	{
		name: 'enfermeria',
		url: '/Enfermeria',
		parent: 'signed',
		template: '<ui-view><sa-loading></sa-loading></ui-view>'
	},
	{
		name: 'enfermeria.stockPorPiso',
		url: '/StockPorPiso',
		template: '<sa-enfermeria-stock-por-piso><sa-loading></sa-loading></sa-enfermeria-stock-por-piso>',
		data: {
			idPermiso: 262,
			module: 'STOCK POR PISO - ENFERMERIA'
		}
	},
	{
		name: 'enfermeria.redEnfermeras',
		url: '/Red',
		template: '<sa-enfermeria-gestion-enfermeras></sa-enfermeria-gestion-enfermeras>',
		data: {
			idPermiso: 264,
			module: 'RED ENFERMERAS'
		}
	},
	{
		name: 'enfermeria.upa',
		url: '/Upa',
		template: '<sa-enfermeria-upa-component></sa-enfermeria-upa-component>',
		data: {
			idPermiso: 265,
			module: 'UPA'
		}
	},
	{
		name: 'enfermeria.indicacionesMedicas',
		url: '/IndicacionesMedicas',
		template: '<sa-enfermeria-indicaciones-medicas><sa-loading></sa-loading></sa-enfermeria-indicaciones-medicas>',
		data: {
			idPermiso: 292,
			module: 'INDICACIONES MEDICAS - ENFERMERIA'
		}
	}
]


export class EnfermeriaHomeStates {
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