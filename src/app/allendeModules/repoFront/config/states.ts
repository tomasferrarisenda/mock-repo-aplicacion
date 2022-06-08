/**
 * @author 			ppautasso
 * @description 	states para repo de front end	
 */
import * as angular from 'angular';

const states = [
	{
		name: 'repofront',
		url: '/RepoFront',
		parent: 'signed',
		template: '<ui-view><sa-loading></sa-loading></ui-view>'
	},
	{
		name: 'repofront.repoelementos',
		url: '/Elementos',
		template: '<sa-repo-elementos-front-end-contenedor></sa-repo-elementos-front-end-contenedor>',
		data: {
			//idPermiso: 273,
			module: 'REPO FRONT - ELEMENTOS'
		}
	}
]


export class RepoFrontHomeStates {
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