/**
* @author: aminoldo
* @description: coponente para Upa
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaUpaController } from './EnfermeriaUpaController';
const EnfermeriaUpaComponentTemplate = require('./EnfermeriaUpaComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaUpaComponentTemplate,
	controller: EnfermeriaUpaController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class EnfermeriaUpaComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaUpaComponent', component);
	}
}