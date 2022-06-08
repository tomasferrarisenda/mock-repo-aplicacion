/**
* @author: ppautasso
* @description: componente para container de new/edit receso individual
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RecesoIndividualContainerController } from './RecesoIndividualContainerController';
const RecesoIndividualContainerTemplate = require('./RecesoIndividualContainerComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RecesoIndividualContainerTemplate,
	controller: RecesoIndividualContainerController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class RecesoIndividualContainerComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRecesoIndividualContainer', component);
	}
}