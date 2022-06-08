/**
* @author: rbassi
* @description: listas de Fcaturacion 
* @type: States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'facturacion.configuraciones.listaFacturacion',
		url: '/listasFacturacion',
		template: '<ui-view><sa-loading></sa-loading></ui-view>',
	
	},
	{
		name: 'facturacion.configuraciones.listaFacturacion.list',
		url: '/List',
		template: '<sa-listas-facturacion-list></sa-listas-facturacion-list>',
		data : {
			idPermiso: 211
		}
	},
	{
		name: 'facturacion.configuraciones.listaFacturacion.edit',
		url: '/Edicion',
		template: '<sa-listas-facturacion-edit></sa-listas-facturacion-edit>',
		data : {
			idPermiso: 211
		},
		params: {
			IdListaEdit: 0 // valor por defecto
		}
	}
]

const redirects = [
	{ from: '/Facturacion/Configuraciones/listasFacturacion', to: '/Facturacion/Configuraciones/listasFacturacion/List'}
]

export class ListasFacturacionStates {

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