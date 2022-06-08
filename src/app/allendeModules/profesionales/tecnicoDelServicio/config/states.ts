/**
* @author:         crusso
* @description:    Tecnicos del Servicio
* @type:           States
**/
import * as angular from 'angular';

const states = [
	{
		name: 'profesionales.tecnicosServicio',
		url: '/TecnicoServicios',
		template: '<sa-tecnicos-servicio-list></sa-tecnicos-servicio-list>',
		data : {
			idPermiso: 248
		}
	}
];

export class TecnicoDelServicioStates {

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