/**
* @author: emansilla
* @description: Lista de unidades arancelarias
* @type: Component
**/
import * as angular from 'angular';
import { UnidadesArancelariasListController } from './UnidadesArancelariasListController';
const UnidadesArancelariasListTemplate = require('./UnidadesArancelariasListComponent.html');

const component: angular.IComponentOptions = {
	template: UnidadesArancelariasListTemplate,
	controller: UnidadesArancelariasListController,
	controllerAs: 'vm'
}

export class UnidadesArancelariasListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saUnidadesArancelariasList', component);

		// En html se usa como sa-unidades-arancelarias-list
	}
}