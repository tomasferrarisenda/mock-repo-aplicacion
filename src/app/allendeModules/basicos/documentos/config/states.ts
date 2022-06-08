/**
* @author:         pferrer
* @description:    Administrador Documentos
* @type:           States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'basicos.documentos',
		url: '/AdministradorDocumentos',
		template: '<sa-administrador-documento-list></sa-administrador-documento-list>',
		data : {
			idPermiso: 246
		}
	}
];

export class AdministradorDocumentoStates {

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